import {
  EthereumAddress,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  HypernetConfig,
  PaymentId,
  GatewayUrl,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  GatewayValidationError,
  PaymentFinalizeError,
  PaymentCreationError,
  InvalidPaymentError,
  PaymentStakeError,
  TransferCreationError,
  TransferResolutionError,
  BalancesUnavailableError,
  VectorError,
  BlockchainUnavailableError,
  EPaymentState,
  UnixTimestamp,
  BigNumberString,
  Signature,
  TransferId,
  ETransferState,
  IHypernetOfferDetails,
  MessageState,
  IBasicTransferResponse,
  LogicalError,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IPaymentService } from "@interfaces/business";
import {
  IAccountsRepository,
  IAccountsRepositoryType,
  ILinkRepository,
  ILinkRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IPaymentRepository,
  IPaymentRepositoryType,
} from "@interfaces/data";
import { HypernetContext } from "@interfaces/objects";
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import { err, errAsync, ok, okAsync, ResultAsync, Result } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IPaymentUtils,
  IPaymentUtilsType,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";

type PaymentsByIdsErrors =
  | VectorError
  | BlockchainUnavailableError
  | InvalidPaymentError
  | InvalidParametersError;

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 * The order of operations for sending funds is as follows:
 * sendFunds() is called by sender, which creates a Message transfer with Vector, which triggers
 * offerReceived() on the recipient side, which tosses an event up to the user, who then calls
 * acceptOffers() to accept the sender's funds, which creates an Insurance transfer with Vector, which triggers
 * stakePosted() on the sender's side, which finally creates the Parameterized transfer with Vector, which triggers
 * paymentPosted() on the recipient's side, which finalizes/resolves the vector parameterized transfer.
 *
 * Note that the general expected order of operations is mirrored by the ordering of functions within this class.
 *
 * @todo we should also finalize the insurance transfer, and maybe finalize the offer transfer
 */
@injectable()
export class PaymentService implements IPaymentService {
  /**
   * Creates an instanceo of the paymentService.
   */

  constructor(
    @inject(ILinkRepositoryType) protected linkRepository: ILinkRepository,
    @inject(IAccountsRepositoryType)
    protected accountRepository: IAccountsRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IPaymentRepositoryType)
    protected paymentRepository: IPaymentRepository,
    @inject(IGatewayConnectorRepositoryType)
    protected gatewayConnectorRepository: IGatewayConnectorRepository,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IPaymentUtilsType) protected paymentUtils: IPaymentUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  /**
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param counterPartyAccount the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds. This must be after the full maturation date of totalAuthorized, as calculated via deltaAmount and deltaTime.
   * @param deltaAmount The amount per deltaTime to authorize
   * @param deltaTime the number of seconds after which deltaAmount will be authorized, up to the limit of totalAuthorized.
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<PullPayment, PaymentCreationError> {
    // @TODO Check deltaAmount, deltaTime, totalAuthorized, and expiration date
    // totalAuthorized / (deltaAmount/deltaTime) > ((expiration date - now) + someMinimumNumDays)

    return ResultUtils.combine([
      this.paymentRepository.createPullPayment(
        counterPartyAccount,
        totalAuthorized,
        deltaTime,
        deltaAmount,
        expirationDate,
        requiredStake,
        paymentToken,
        gatewayUrl,
        metadata,
      ),
      this.contextProvider.getContext(),
    ]).map((vals) => {
      const [payment, context] = vals;

      // Send an event
      context.onPullPaymentSent.next(payment);

      return payment;
    });
  }

  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<Payment, PaymentsByIdsErrors | PaymentCreationError> {
    // Pull the up the payment
    return this.paymentRepository
      .getPaymentsByIds([paymentId])
      .andThen((payments) => {
        const payment = payments.get(paymentId);

        // Verify that it is indeed a pull payment
        if (payment instanceof PullPayment) {
          const amountTransferred = BigNumber.from(payment.amountTransferred);
          // Verify that we're not pulling too quickly (greater than the average rate)
          if (amountTransferred.add(amount).gt(payment.vestedAmount)) {
            return errAsync(
              new InvalidParametersError(
                `Amount of ${amount} exceeds the vested payment amount of ${payment.vestedAmount}`,
              ),
            );
          }

          // Verify that the amount we're trying to pull does not exceed the total authorized amount
          if (amountTransferred.add(amount).gt(payment.authorizedAmount)) {
            return errAsync(
              new InvalidParametersError(
                `Amount of ${amount} exceeds the total authorized amount of ${payment.authorizedAmount}`,
              ),
            );
          }

          // Create the PullRecord
          return this.paymentRepository
            .createPullRecord(paymentId, amount)
            .andThen((payment) => {
              return this._refreshBalances().map(() => {
                return payment;
              });
            });
        } else {
          return errAsync(
            new InvalidParametersError(
              "Can not pull funds from a non pull payment",
            ),
          );
        }
      });
  }

  /**
   * Sends a payment to the specified recipient.
   * Internally, creates a null/message/offer transfer to communicate
   * with the counterparty and signal a request for a stake.
   * @param counterPartyAccount the intended recipient
   * @param amount the amount of payment to send
   * @param expirationDate the expiration date at which point this payment will revert
   * @param requiredStake the amount of insurance the counterparty should put up
   * @param paymentToken the (Ethereum) address of the payment token
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumAddress,
    gatewayUrl: GatewayUrl,
    metadata: string | null,
  ): ResultAsync<PushPayment, PaymentCreationError> {
    // TODO: Sanity checking on the values
    return ResultUtils.combine([
      this.paymentRepository.createPushPayment(
        counterPartyAccount,
        amount,
        expirationDate,
        requiredStake,
        paymentToken,
        gatewayUrl,
        metadata,
      ),
      this.contextProvider.getContext(),
    ]).map((vals) => {
      const [payment, context] = vals;

      // Send an event
      context.onPushPaymentSent.next(payment);

      return payment;
    });
  }

  /**
   * Called when someone has sent us a payment offer.
   * Lookup the transfer, and convert it to a payment.
   * Then, publish an RXJS event to the user.
   * @param paymentId the paymentId for the offer
   */
  public offerReceived(
    paymentId: PaymentId,
  ): ResultAsync<void, PaymentsByIdsErrors> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    return prerequisites.andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(
          new InvalidPaymentError(
            `PaymentService:offerReceived():Could not get payment!`,
          ),
        );
      }

      // offerReceived will be called even if we are the ones that created
      // the transfer. Because of that, we only want to generate an event
      // if the payment is TO us.
      if (
        payment.state !== EPaymentState.Proposed ||
        payment.to !== context.publicIdentifier
      ) {
        // The payment has already moved forward, somehow.
        // We don't need to do anything, we probably got called
        // by another instance of the core.
        return okAsync(undefined);
      }

      // Payment state is 'Proposed' and to us, continue to handle
      if (payment instanceof PushPayment) {
        // Someone wants to send us a pushPayment, emit up to the api
        context.onPushPaymentReceived.next(payment);
      } else if (payment instanceof PullPayment) {
        // Someone wants to send us a pullPayment, emit up to the api
        context.onPullPaymentReceived.next(payment);
      } else {
        throw new LogicalError("Unknown payment type!");
      }

      return this._refreshBalances();
    });
  }

  /**
   * For each paymentID provided, attempts to accept funds (ie: provide a stake) for that payment.
   * @param paymentIds a list of paymentIds for which to accept funds for
   */
  public acceptOffers(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Result<Payment, AcceptPaymentError>[],
    | InsufficientBalanceError
    | AcceptPaymentError
    | BalancesUnavailableError
    | GatewayValidationError
    | PaymentsByIdsErrors
  > {
    let config: HypernetConfig;
    let payments: Map<PaymentId, Payment>;
    const gatewayUrls = new Set<GatewayUrl>();

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.paymentRepository.getPaymentsByIds(paymentIds),
    ])
      .andThen((vals) => {
        [config, payments] = vals;

        // Iterate over the payments, and find all the gateway URLs.

        for (const keyval of payments) {
          gatewayUrls.add(keyval[1].gatewayUrl);
        }

        return ResultUtils.combine([
          this.accountRepository.getBalanceByAsset(config.hypertokenAddress),
          this.gatewayConnectorRepository.getGatewayRegistrationInfo(
            Array.from(gatewayUrls),
          ),
        ]);
      })
      .andThen((vals) => {
        const [hypertokenBalance, registrationInfo] = vals;

        // If we don't have a public key for each gateway, then we should not proceed.
        if (gatewayUrls.size != registrationInfo.size) {
          return errAsync(
            new GatewayValidationError("Not all gateways are authorized!"),
          );
        }

        // For each payment ID, call the singular version of acceptOffers
        // Wrap each one as a Result object, and return an array of Results
        let totalStakeRequired = BigNumber.from(0);
        // First, verify to make sure that we have enough hypertoken to cover the insurance collectively
        for (const [key, payment] of payments) {
          if (payment.state !== EPaymentState.Proposed) {
            return errAsync(
              new AcceptPaymentError(
                `Cannot accept payment ${payment.id}, it is not in the Proposed state`,
              ),
            );
          }

          totalStakeRequired = totalStakeRequired.add(
            BigNumber.from(payment.requiredStake),
          );
        }

        // Check the balance and make sure you have enough HyperToken to cover it
        if (
          BigNumber.from(hypertokenBalance.freeAmount).lt(totalStakeRequired)
        ) {
          return errAsync(
            new InsufficientBalanceError(
              "Not enough Hypertoken to cover provided payments.",
            ),
          );
        }

        // Now that we know we can (probably) make the payments, let's try
        const stakeAttempts = new Array<
          Promise<Result<Payment, AcceptPaymentError>>
        >();
        for (const keyval of payments) {
          const [paymentId, payment] = keyval;
          this.logUtils.log(
            `PaymentService:acceptOffers: attempting to provide stake for payment ${paymentId}`,
          );

          // We need to get the public key of the gateway for the payment
          const gatewayRegistrationInfo = registrationInfo.get(
            payment.gatewayUrl,
          );

          if (gatewayRegistrationInfo != null) {
            const stakeAttempt = this.paymentRepository
              .provideStake(paymentId, gatewayRegistrationInfo.address)
              .match(
                (payment) => ok(payment) as Result<Payment, AcceptPaymentError>,
                (e) =>
                  err(
                    new AcceptPaymentError(
                      `Payment ${paymentId} could not be staked!`,
                      e,
                    ),
                  ),
              );

            stakeAttempts.push(stakeAttempt);
          } else {
            throw new LogicalError(
              "Gateway does not have a public key; are they ",
            );
          }
        }
        return ResultAsync.fromPromise(
          Promise.all(stakeAttempts),
          (e) => new AcceptPaymentError("Error while staking payment", e),
        ).andThen((paymentsResult) => {
          return this._refreshBalances().map(() => paymentsResult);
        });
      });
  }

  /**
   * Notifies the service that a stake has been posted; if verified,
   * then provides assets to the counterparty (ie a parameterizedPayment)
   * @param paymentId the paymentId for the stake
   */
  public stakePosted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | InvalidPaymentError
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    this.logUtils.debug(`Insurance transfer created for payment ${paymentId}`);

    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`);
        return errAsync(new InvalidPaymentError("Invalid payment ID!"));
      }

      // Let the UI know we got an insurance transfer
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return this._advancePayment(payment, context);
    });
  }

  /**
   * Notifies the service that the parameterized payment has been created.
   * Called by the reciever of a parameterized transfer, AFTER they have put up stake,
   * and after the sender has created the Parameterized transfer
   * @param paymentId the payment ID to accept/resolve
   */
  public paymentPosted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    this.logUtils.debug(`Payment transfer created for payment ${paymentId}`);

    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`);
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Let the UI know we got a parameterized transfer. For push payments, this is
      // just an update, for a pull payment, it means you can start pulling
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentReceived.next(payment);
      }

      return this._advancePayment(payment, context);
    });
  }

  /**
   * Notifies the service that the parameterized payment has been resolved.
   * @param paymentId the payment id that has been resolved.
   */
  public paymentCompleted(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`);
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Let the UI know we got an insurance transfer
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return this._advancePayment(payment, context);
    });
  }

  public offerResolved(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  > {
    this.logUtils.debug(`Offer transfer resolved for payment ${paymentId}`);

    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`);
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Let the UI know we got an insurance transfer
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return this._advancePayment(payment, context);
    });
  }

  /**
   * Right now, if the insurance is resolved, all we need to do is generate an update event.
   *
   * @param paymentId
   */
  public insuranceResolved(
    paymentId: PaymentId,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    this.logUtils.debug(`Insurance transfer resolved for payment ${paymentId}`);

    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`);
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Let the UI know we got an insurance transfer
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return this._advancePayment(payment, context);
    });
  }

  /**
   * Notifies the service that a pull-payment has been recorded.
   * @param paymentId the paymentId for the pull-payment
   */
  public pullRecorded(
    paymentId: PaymentId,
  ): ResultAsync<void, PaymentsByIdsErrors> {
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Notify the world that this pull payment was updated
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return this._refreshBalances();
    });
  }

  public resolveInsurance(
    paymentId: PaymentId,
    amount: BigNumberString,
    gatewaySignature: Signature | null,
  ): ResultAsync<
    Payment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  > {
    // Get the payment
    return this.paymentRepository
      .getPaymentsByIds([paymentId])
      .andThen((payments) => {
        const payment = payments.get(paymentId);

        if (payment == null) {
          return errAsync(new InvalidParametersError("Invalid payment ID"));
        }

        // You can only resolve payments insurance that are in the accepted state- the reciever has taken their money but you they still
        // have payment amount staked as an insurace amount.
        // The second condition can't happen if it's in Accepted unless something is very, very badly wrong,
        // but it keeps typescript happy
        if (payment.state != EPaymentState.Accepted) {
          return errAsync(
            new InvalidParametersError(
              "Can not resolve payment that is not in the Accepted state",
            ),
          );
        }
        // Making sure the payment staked amount(the insurance amount) is equal to the payment required staked amount
        if (
          payment.amountStaked.toString() != payment.requiredStake.toString()
        ) {
          return errAsync(
            new InvalidParametersError(
              "Payment insurance amount should be equal to payment required staked amount",
            ),
          );
        }

        // A payment could have multiple insurance transfers and still be accepted if all
        // but one are canceled.
        return ResultUtils.filter(
          payment.details.insuranceTransfers,
          (transfer) => {
            return this.vectorUtils
              .getTransferStateFromTransfer(transfer)
              .map((transferState) => transferState == ETransferState.Active);
          },
        )
          .andThen((activeInsuranceTransfers) => {
            if (activeInsuranceTransfers.length > 1) {
              throw new Error(
                "Accepted payment has multiple active insurance payments?!",
              );
            }

            if (activeInsuranceTransfers.length == 0) {
              throw new Error(
                "Accepted payment has no active insurance payments?!",
              );
            }

            // Resolve the insurance
            this.logUtils.debug(`Resolving insurance for payment ${paymentId}`);
            return this.paymentRepository.resolveInsurance(
              paymentId,
              TransferId(activeInsuranceTransfers[0].transferId),
              amount,
              gatewaySignature,
            );
          })
          .andThen(() => {
            return this.paymentRepository.getPaymentsByIds([paymentId]);
          })
          .andThen((payments) => {
            const payment = payments.get(paymentId);
            if (payment == null) {
              return errAsync(new InvalidParametersError("Invalid payment ID"));
            }
            return okAsync(payment);
          });
      });
  }

  public advancePayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds(paymentIds),
      this.contextProvider.getContext(),
    ])
      .map((vals) => {
        const [payments, context] = vals;

        const paymentAdvancements = new Array<
          ResultAsync<
            void,
            | PaymentFinalizeError
            | PaymentStakeError
            | TransferResolutionError
            | PaymentsByIdsErrors
            | TransferCreationError
          >
        >();
        for (const payment of payments.values()) {
          paymentAdvancements.push(this._advancePayment(payment, context));
        }
        return ResultUtils.combine(paymentAdvancements);
      })
      .map(() => {});
  }

  public recoverPayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Payment[],
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
  > {
    // Recover payments will work to restore a "borked" payment to a usable status.
    // First step, get the payments.
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds(paymentIds),
      this.contextProvider.getInitializedContext(),
    ])
      .andThen((vals) => {
        const [paymentsById, context] = vals;
        const borkedPayments = new Array<Payment>();
        // Sort out the payments that are borked. We are only worried about those.
        for (const payment of paymentsById.values()) {
          if (payment.state === EPaymentState.Borked) {
            borkedPayments.push(payment);
          }
        }

        // Now we have a list of borked payments. Let's try and recover them.
        return ResultUtils.combine(
          borkedPayments.map((payment) => {
            return this._recoverPayment(payment, context);
          }),
        );
      })
      .andThen(() => {
        return this.paymentRepository.getPaymentsByIds(paymentIds);
      })
      .map((paymentsById) => {
        return Array.from(paymentsById.values());
      });
  }

  protected _recoverPayment(
    payment: Payment,
    context: HypernetContext,
  ): ResultAsync<void, BlockchainUnavailableError | TransferResolutionError> {
    // We need to figure out why the payment is borked. We'll start looking at each possible cause
    // Depending on if the payment is too us or from us, there are different things we can fix.
    // The main things we can recover from are A. multiple payments/transfers, and B. invalid
    // payments/transfers. If there are multiples, we will just cancel the extra ones.
    // If there are invalid transfers, we need to just back out of the whole process.

    // We have the transfers sorted via the payment details
    // If there are no offer transfers at all, then recovery boils down to canceling everything we can.
    const hasOfferTransfers = payment.details.offerTransfers.length > 0;
    if (!hasOfferTransfers) {
      return this._cancelEverything(context, payment);
    }

    // If we have an offer transfer or two, we need to figure out the offer transfer to use to get the offer details.
    // The valid offer transfer we will use is the first one, regardless of its state.
    const offerTransfer = this.paymentUtils.getFirstTransfer(
      payment.details.offerTransfers,
    );
    const offerDetails: IHypernetOfferDetails = JSON.parse(
      (offerTransfer.transferState as MessageState).message,
    );

    // Now we have the offer details.  We need to sort the transfers out even further.
    // For each transfer, we need to know the current state of the transfer and if it
    // is valid or not (valid = matches the offer)

    return ResultUtils.combine([
      ResultUtils.map(payment.details.offerTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
      ResultUtils.map(payment.details.insuranceTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return {
              transfer: val,
              transferState: transferState,
              valid: this.paymentUtils.validateInsuranceTransfer(
                val,
                offerDetails,
              ),
            };
          });
      }),
      ResultUtils.map(payment.details.parameterizedTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return {
              transfer: val,
              transferState: transferState,
              valid: this.paymentUtils.validatePaymentTransfer(
                val,
                offerDetails,
              ),
            };
          });
      }),
      ResultUtils.map(payment.details.pullRecordTransfers, (val) => {
        return this.vectorUtils
          .getTransferStateFromTransfer(val)
          .map((transferState) => {
            return { transfer: val, transferState: transferState };
          });
      }),
    ])
      .andThen((vals) => {
        const [
          offerTransferStats,
          insuranceTransferStats,
          parameterizedTransferStats,
          pullRecordTransfers,
        ] = vals;

        // Now we have the transfers, their state, and their validity.
        // If we found any invalid transfers, that basically means we are not going
        // to retry the payment (via _advancePayment)
        if (context.publicIdentifier == payment.to) {
          // It's to us, so the offer and payment transfers can be canceled
          // We will cancel all the non-valid offer transfers
          const offerTransfersToCancel = offerTransferStats.filter((val) => {
            return (
              val.transfer.transferId != offerTransfer.transferId &&
              val.transferState == ETransferState.Active
            );
          });

          return ResultUtils.map(offerTransfersToCancel, (transfer) => {
            return this.vectorUtils.cancelMessageTransfer(
              TransferId(transfer.transfer.transferId),
            );
          }).andThen(() => {
            // Payment transfers to cancel are any beyond the first
            if (parameterizedTransferStats.length > 1) {
              const parameterizedTransfer = this.paymentUtils.getFirstTransfer(
                payment.details.parameterizedTransfers,
              );
              const parameterizedTransfersToCancel =
                parameterizedTransferStats.filter((val) => {
                  return (
                    val.transfer.transferId !=
                      parameterizedTransfer.transferId &&
                    val.transferState == ETransferState.Active
                  );
                });

              // The only real descision to make as far as recovery, is whether or not to cancel
              // the first transaction. We will only cancel it if it is invalid.
              // The state and validity is in parameterizedTransfers
              const parameterizedTransferStat = parameterizedTransferStats.find(
                (val) =>
                  val.transfer.transferId === parameterizedTransfer.transferId,
              );
              if (parameterizedTransferStat == null) {
                throw new Error(
                  "First parameterized transfer does not exist in parameterizedTransferStats",
                );
              }
              if (!parameterizedTransferStat.valid) {
                parameterizedTransfersToCancel.push(parameterizedTransferStat);
              }

              // Now just cancel the transfers
              return ResultUtils.map(
                parameterizedTransfersToCancel,
                (transferStat) => {
                  return this.vectorUtils.cancelParameterizedTransfer(
                    TransferId(transferStat.transfer.transferId),
                  );
                },
              );
            }
            return okAsync<IBasicTransferResponse[], TransferResolutionError>(
              [],
            );
          });
        } else if (context.publicIdentifier == payment.from) {
          // It's from us, so we can only cancel the insurance payments
          // Payment transfers to cancel are any beyond the first
          if (insuranceTransferStats.length > 1) {
            const insuranceTransfer = this.paymentUtils.getFirstTransfer(
              payment.details.insuranceTransfers,
            );
            const insuranceTransfersToCancel = insuranceTransferStats.filter(
              (val) => {
                return (
                  val.transfer.transferId != insuranceTransfer.transferId &&
                  val.transferState == ETransferState.Active
                );
              },
            );

            // The only real descision to make as far as recovery, is whether or not to cancel
            // the first transaction. We will only cancel it if it is invalid.
            // The state and validity is in insuranceTransferStats
            const insuranceTransferStat = insuranceTransferStats.find(
              (val) => val.transfer.transferId === insuranceTransfer.transferId,
            );
            if (insuranceTransferStat == null) {
              throw new Error(
                "First insurance transfer does not exist in insuranceTransferStats",
              );
            }
            if (!insuranceTransferStat.valid) {
              insuranceTransfersToCancel.push(insuranceTransferStat);
            }

            // Now just cancel the transfers
            return ResultUtils.map(
              insuranceTransfersToCancel,
              (transferStat) => {
                return this.vectorUtils.cancelInsuranceTransfer(
                  TransferId(transferStat.transfer.transferId),
                );
              },
            );
          }
          return okAsync<IBasicTransferResponse[], TransferResolutionError>([]);
        }
        return okAsync<IBasicTransferResponse[], TransferResolutionError>([]);
      })
      .andThen(() => {
        // TODO: Figure out if there is a better way to update the Payment after the cancels
        return okAsync<void, TransferResolutionError>(undefined);
      })
      .map(() => {});
  }

  protected _cancelEverything(
    context: HypernetContext,
    payment: Payment,
  ): ResultAsync<void, TransferResolutionError> {
    if (context.publicIdentifier == payment.to) {
      return ResultUtils.combine([
        ResultUtils.map(payment.details.offerTransfers, (transfer) => {
          return this.vectorUtils.cancelMessageTransfer(
            TransferId(transfer.transferId),
          );
        }),
      ]).map(() => {});
    } else if (context.publicIdentifier == payment.from) {
      return ResultUtils.combine([
        ResultUtils.map(payment.details.offerTransfers, (transfer) => {
          return this.vectorUtils.cancelMessageTransfer(
            TransferId(transfer.transferId),
          );
        }),
      ]).map(() => {});
    }
    return okAsync(undefined);
  }

  protected _advancePayment(
    payment: Payment,
    context: HypernetContext,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    this.logUtils.debug(`Advancing payment ${payment.id}`);
    this.logUtils.debug(`Current payment status is ${payment.state}`);

    return this.gatewayConnectorRepository
      .getAuthorizedGatewaysConnectorsStatus()
      .andThen((gatewayConnectorStatusMap) => {
        const gatewayConnectorStatus = gatewayConnectorStatusMap.get(
          payment.gatewayUrl,
        );
        this.logUtils.debug(
          `In _advancePayment, gatewayConnectorStatus = ${
            gatewayConnectorStatus == true
          }`,
        );
        if (gatewayConnectorStatus == true) {
          return this._advancePaymentForActivatedGateway(payment, context).map(
            () => {},
          );
        } else {
          // Gateway is not active, so we will not advance the payment
          this.logUtils.debug(
            `Gateway inactive, payment ${payment.id} will be delayed`,
          );

          // fire an event for payment advancement error / onPaymentDelay
          if (payment instanceof PushPayment) {
            context.onPushPaymentDelayed.next(payment);
          }
          if (payment instanceof PullPayment) {
            context.onPullPaymentDelayed.next(payment);
          }
          return this._refreshBalances();
        }
      });
  }

  protected _advancePaymentForActivatedGateway(
    payment: Payment,
    context: HypernetContext,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | PaymentsByIdsErrors
    | TransferCreationError
  > {
    // Notified the UI, move on to advancing the state of the payment.
    // Payment state must be in "staked" in order to progress
    const paymentId = payment.id;
    if (
      payment.state == EPaymentState.Staked &&
      payment.from === context.publicIdentifier
    ) {
      // If the payment state is staked, we know that the proper
      // insurance has been posted.
      this.logUtils.log(`Providing asset for paymentId ${paymentId}`);
      return this.paymentRepository
        .provideAsset(paymentId)
        .andThen((updatedPayment) => {
          if (updatedPayment instanceof PushPayment) {
            context.onPushPaymentUpdated.next(updatedPayment);
          }
          if (updatedPayment instanceof PullPayment) {
            context.onPullPaymentUpdated.next(updatedPayment);
          }
          return okAsync(updatedPayment);
        });
    }

    // Payment state must be in "approved" to finalize
    if (
      payment.state == EPaymentState.Approved &&
      payment.to === context.publicIdentifier
    ) {
      // If the payment state is approved, we know that it matches our insurance payment
      if (payment instanceof PushPayment) {
        this.logUtils.debug(
          `Resolving parameterized transfer to move payment ${payment.id} from Approved to Accepted`,
        );
        // Resolve the parameterized payment immediately for the full balance
        return this.paymentRepository
          .acceptPayment(paymentId, payment.paymentAmount)
          .map((finalizedPayment) => {
            context.onPushPaymentUpdated.next(finalizedPayment as PushPayment);
            return payment;
          });
      }
    }

    // Once the insurance is resolved, there is no need to keep the offer around
    // Resolve it
    if (
      payment.state == EPaymentState.InsuranceReleased &&
      payment.to === context.publicIdentifier
    ) {
      this.logUtils.debug(
        `Resolving offer transfer to move payment ${payment.id} from Insurance Resolved to Finalize`,
      );
      return this.paymentRepository.finalizePayment(payment).map(() => {
        payment.state = EPaymentState.Finalized;
        if (payment instanceof PushPayment) {
          context.onPushPaymentUpdated.next(payment);
        }
        if (payment instanceof PullPayment) {
          context.onPullPaymentUpdated.next(payment);
        }
        return payment;
      });
    }

    if (payment.state == EPaymentState.Borked) {
      this.logUtils.debug(`Attempting to recover borked payment ${payment.id}`);
      return this._recoverPayment(payment, context).map(() => {
        return payment;
      });
    }

    return okAsync(payment);
  }

  // Caculates balances and update the context after that
  private _refreshBalances(): ResultAsync<
    void,
    BalancesUnavailableError | VectorError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.accountRepository.getBalances(),
    ]).map((vals) => {
      const [context, balances] = vals;
      context.onBalancesChanged.next(balances);
    });
  }
}
