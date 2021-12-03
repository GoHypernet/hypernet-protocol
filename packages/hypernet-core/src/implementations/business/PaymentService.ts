import {
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
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
  ProxyError,
  InvalidPaymentIdError,
  EthereumContractAddress,
  EPaymentType,
  paymentSigningDomain,
  pushPaymentSigningTypes,
  NonFungibleRegistryContractError,
  PersistenceError,
  pullPaymentSigningTypes,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  ILogUtils,
  ILogUtilsType,
  IValidationUtils,
  IValidationUtilsType,
} from "@hypernetlabs/utils";
import { GetPaymentResponse, IPaymentService } from "@interfaces/business";
import {
  IAccountsRepository,
  IAccountsRepositoryType,
  ILinkRepository,
  ILinkRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IPaymentRepository,
  IPaymentRepositoryType,
  IGatewayRegistrationRepositoryType,
  IGatewayRegistrationRepository,
} from "@interfaces/data";
import {
  HypernetContext,
  PaymentInitiationResponse,
} from "@interfaces/objects";
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainTimeUtils,
  IBlockchainTimeUtilsType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IPaymentUtils,
  IPaymentUtilsType,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 * The order of operations for sending funds is as follows:
 * sendFunds() is called by sender, which creates a Message transfer with Vector, which triggers
 * offerReceived() on the recipient side, which tosses an event up to the user, who then calls
 * acceptOffer() to accept the sender's funds, which creates an Insurance transfer with Vector, which triggers
 * stakePosted() on the sender's side, which finally creates the Parameterized transfer with Vector, which triggers
 * paymentPosted() on the recipient's side, which finalizes/resolves the vector parameterized transfer.
 *
 * Note that the general expected order of operations is mirrored by the ordering of functions within this class.
 */
@injectable()
export class PaymentService implements IPaymentService {
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
    @inject(IGatewayRegistrationRepositoryType)
    protected gatewayRegistrationRepository: IGatewayRegistrationRepository,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IPaymentUtilsType) protected paymentUtils: IPaymentUtils,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IBlockchainTimeUtilsType)
    protected blockchainTimeUtils: IBlockchainTimeUtils,
    @inject(IValidationUtilsType) protected validationUtils: IValidationUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initiateAuthorizeFunds(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    PaymentInitiationResponse,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
  > {
    // Step 1: Sanity checking on the values
    return this._validatePullPayment(
      gatewayUrl,
      requestIdentifier,
      channelAddress,
      toIdentifier,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      metadata,
    )
      .andThen(() => {
        // Create a payment ID
        return this.paymentUtils.createPaymentId(EPaymentType.Push);
      })
      .andThen((paymentId) => {
        // We need to store the payment Id as reserved.
        return this.paymentRepository
          .addReservedPaymentId(requestIdentifier, paymentId)
          .andThen(() => {
            return okAsync(
              new PaymentInitiationResponse(requestIdentifier, paymentId),
            );
          });
      });
  }

  /**
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param toIdentifier the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds. This must be after the full maturation date of totalAuthorized, as calculated via deltaAmount and deltaTime.
   * @param deltaAmount The amount per deltaTime to authorize
   * @param deltaTime the number of seconds after which deltaAmount will be authorized, up to the limit of totalAuthorized.
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param gatewayUrl the registered URL for the gateway that will resolve any disputes.
   */
  public authorizeFunds(
    requestIdentifier: string,
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    gatewaySignature: Signature,
    metadata: string | null,
  ): ResultAsync<
    PullPayment,
    | PaymentCreationError
    | TransferCreationError
    | VectorError
    | BlockchainUnavailableError
    | InvalidParametersError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
    | NonFungibleRegistryContractError
  > {
    // @TODO Check deltaAmount, deltaTime, totalAuthorized, and expiration date
    // totalAuthorized / (deltaAmount/deltaTime) > ((expiration date - now) + someMinimumNumDays)

    return this._validatePullPayment(
      gatewayUrl,
      requestIdentifier,
      channelAddress,
      toIdentifier,
      totalAuthorized,
      expirationDate,
      deltaAmount,
      deltaTime,
      requiredStake,
      paymentToken,
      metadata,
    )
      .andThen(() => {
        return ResultUtils.combine([
          this.paymentRepository.getReservedPaymentIdByRequestId(
            requestIdentifier,
          ),
          this.gatewayRegistrationRepository.getGatewayRegistrationInfo([
            gatewayUrl,
          ]),
        ]);
      })
      .andThen(([reservedPaymentId, gatewayRegistrationInfoMap]) => {
        // Make sure the payment ID for this request matches the reserved payment.
        // This would also show up via the signature check
        if (reservedPaymentId != paymentId) {
          return errAsync(
            new PaymentCreationError(
              `Mismatch between payment initiation and payment; reserved PaymentId ${reservedPaymentId} does not match PaymentId ${paymentId}`,
            ),
          );
        }
        const gatewayRegistrationInfo =
          gatewayRegistrationInfoMap.get(gatewayUrl);
        if (gatewayRegistrationInfo == null) {
          return errAsync(
            new PaymentCreationError(
              `No registration info for gateway with url ${gatewayUrl}. Cannot authorize funds for payment ${paymentId} with request id ${requestIdentifier}`,
            ),
          );
        }

        // Check the signature
        const value = {
          requestIdentifier: requestIdentifier,
          paymentId: paymentId,
          channelAddress: channelAddress,
          recipientPublicIdentifier: toIdentifier,
          totalAuthorized: totalAuthorized,
          expirationDate: expirationDate,
          deltaAmount: deltaAmount,
          deltaTime: deltaTime,
          requiredStake: requiredStake,
          paymentToken: paymentToken,
          metadata: metadata ?? "",
        } as Record<string, unknown>;

        const verifiedGatewayAccount = this.blockchainUtils.verifyTypedData(
          paymentSigningDomain,
          pullPaymentSigningTypes,
          value,
          gatewaySignature,
        );

        // Make sure that the verified account matches the gateway's published account adddress
        if (verifiedGatewayAccount != gatewayRegistrationInfo.address) {
          return errAsync(
            new PaymentCreationError(
              `Payment ${paymentId} with request id ${requestIdentifier} has an improper signature. Will not send funds!`,
            ),
          );
        }

        return ResultUtils.combine([
          this.paymentRepository.createPullPayment(
            paymentId,
            channelAddress,
            toIdentifier,
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
        ]);
      })
      .map(([payment, context]) => {
        // Send an event
        context.onPullPaymentSent.next(payment);

        return payment;
      });
  }

  public pullFunds(
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<
    Payment,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
    | PaymentCreationError
    | InvalidPaymentIdError
  > {
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
            return errAsync<
              Payment,
              | VectorError
              | BlockchainUnavailableError
              | InvalidPaymentError
              | InvalidParametersError
              | BalancesUnavailableError
              | PaymentCreationError
            >(
              new InvalidParametersError(
                `Amount of ${amount} exceeds the vested payment amount of ${payment.vestedAmount}`,
              ),
            );
          }

          // Verify that the amount we're trying to pull does not exceed the total authorized amount
          if (amountTransferred.add(amount).gt(payment.authorizedAmount)) {
            return errAsync<
              Payment,
              | VectorError
              | BlockchainUnavailableError
              | InvalidPaymentError
              | InvalidParametersError
              | BalancesUnavailableError
              | PaymentCreationError
            >(
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
          return errAsync<
            Payment,
            | VectorError
            | BlockchainUnavailableError
            | InvalidPaymentError
            | InvalidParametersError
            | BalancesUnavailableError
            | PaymentCreationError
          >(
            new InvalidParametersError(
              "Can not pull funds from a non pull payment",
            ),
          );
        }
      });
  }

  /**
   * This method needs to confirm that the payment is legit, generate a payment ID, and sign everything.
   * The payment ID and signature are returned to the gateway connector and then to the gateway. The gateway
   * must then sign all the data, and return the complete request, including the protocol and gateway signatures,
   * which will go to sendFunds() to actually start the payment.
   * @param gatewayUrl
   * @param requestIdentifier
   * @param channelAddress
   * @param toIdentifier
   * @param amount
   * @param expirationDate
   * @param requiredStake
   * @param paymentToken
   * @param metadata
   */
  public initiateSendFunds(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    PaymentInitiationResponse,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
  > {
    // TODO: Step 1: Sanity checking on the values
    return this._validatePushPayment(
      gatewayUrl,
      requestIdentifier,
      channelAddress,
      toIdentifier,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      metadata,
    )
      .andThen(() => {
        // Create a payment ID
        return this.paymentUtils.createPaymentId(EPaymentType.Push);
      })
      .andThen((paymentId) => {
        // We need to store the payment Id as reserved.
        return this.paymentRepository
          .addReservedPaymentId(requestIdentifier, paymentId)
          .map(() => {
            return new PaymentInitiationResponse(requestIdentifier, paymentId);
          });
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
    requestIdentifier: string,
    paymentId: PaymentId,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    gatewayUrl: GatewayUrl,
    gatewaySignature: Signature,
    metadata: string | null,
  ): ResultAsync<
    PushPayment,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
    | InvalidParametersError
    | NonFungibleRegistryContractError
    | TransferCreationError
  > {
    return this._validatePushPayment(
      gatewayUrl,
      requestIdentifier,
      channelAddress,
      toIdentifier,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      metadata,
    )
      .andThen(() => {
        return ResultUtils.combine([
          this.paymentRepository.getReservedPaymentIdByRequestId(
            requestIdentifier,
          ),
          this.gatewayRegistrationRepository.getGatewayRegistrationInfo([
            gatewayUrl,
          ]),
        ]);
      })
      .andThen(([reservedPaymentId, gatewayRegistrationInfoMap]) => {
        // Make sure the payment ID for this request matches the reserved payment.
        // This would also show up via the signature check
        if (reservedPaymentId != paymentId) {
          return errAsync(
            new PaymentCreationError(
              `Mismatch between payment initiation and payment; reserved PaymentId ${reservedPaymentId} does not match PaymentId ${paymentId}`,
            ),
          );
        }

        const gatewayRegistrationInfo =
          gatewayRegistrationInfoMap.get(gatewayUrl);
        if (gatewayRegistrationInfo == null) {
          return errAsync(
            new PaymentCreationError(
              `No registration info for gateway with url ${gatewayUrl}. Cannot send funds for payment ${paymentId} with request id ${requestIdentifier}`,
            ),
          );
        }

        // Check the signature
        const value = {
          requestIdentifier: requestIdentifier,
          paymentId: paymentId,
          channelAddress: channelAddress,
          recipientPublicIdentifier: toIdentifier,
          amount: amount,
          expirationDate: expirationDate,
          requiredStake: requiredStake,
          paymentToken: paymentToken,
          metadata: metadata ?? "",
        } as Record<string, unknown>;

        const verifiedGatewayAccount = this.blockchainUtils.verifyTypedData(
          paymentSigningDomain,
          pushPaymentSigningTypes,
          value,
          gatewaySignature,
        );

        // Make sure that the verified account matches the gateway's published account adddress
        if (verifiedGatewayAccount != gatewayRegistrationInfo.address) {
          return errAsync(
            new PaymentCreationError(
              `Payment ${paymentId} with request id ${requestIdentifier} has an improper signature. Will not send funds!`,
            ),
          );
        }

        // Seems legit
        return ResultUtils.combine([
          this.paymentRepository.createPushPayment(
            paymentId,
            channelAddress,
            toIdentifier,
            amount,
            expirationDate,
            requiredStake,
            paymentToken,
            gatewayUrl,
            metadata,
          ),
          this.contextProvider.getContext(),
        ]).map(([payment, context]) => {
          // Send an event
          context.onPushPaymentSent.next(payment);

          return payment;
        });
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
  ): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
    | InvalidPaymentIdError
  > {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    return prerequisites.andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync<
          void,
          | VectorError
          | BlockchainUnavailableError
          | InvalidPaymentError
          | InvalidParametersError
          | BalancesUnavailableError
        >(
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
   * Attempts to accept funds (ie: provide a stake) for that payment.
   * @param paymentId a paymentId for which to accept funds for
   */
  public acceptOffer(
    paymentId: PaymentId,
  ): ResultAsync<
    Payment,
    | TransferCreationError
    | VectorError
    | BalancesUnavailableError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | PaymentStakeError
    | TransferResolutionError
    | AcceptPaymentError
    | InsufficientBalanceError
    | InvalidPaymentIdError
    | PaymentCreationError
    | NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.paymentRepository.getPaymentsByIds([paymentId]),
    ]).andThen(([config, context, payments]) => {
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync<
          Payment,
          | TransferCreationError
          | VectorError
          | BalancesUnavailableError
          | BlockchainUnavailableError
          | InvalidPaymentError
          | InvalidParametersError
          | PaymentStakeError
          | TransferResolutionError
          | AcceptPaymentError
          | InsufficientBalanceError
        >(new AcceptPaymentError(`Payment ${paymentId} does not exist!`));
      }

      // Get the state channel for the payment
      const stateChannel = context.activeStateChannels?.find((asc) => {
        return (
          asc.chainId == payment.chainId &&
          asc.routerPublicIdentifier == payment.routerPublicIdentifier
        );
      });

      if (stateChannel == null) {
        return errAsync<Payment, AcceptPaymentError>(
          new AcceptPaymentError(
            "State channel for payment ${paymentId} does not exist",
          ),
        );
      }

      // We need to make sure that we have a sufficient balance of hypertoken in the channel to accept the payment
      return this.gatewayRegistrationRepository
        .getGatewayRegistrationInfo([payment.gatewayUrl])
        .andThen((registrationInfo) => {
          const gatewayRegistrationInfo = registrationInfo.get(
            payment.gatewayUrl,
          );

          // If we don't have a public key for each gateway, then we should not proceed.
          if (gatewayRegistrationInfo == null) {
            return errAsync<
              Payment,
              | TransferCreationError
              | VectorError
              | BalancesUnavailableError
              | BlockchainUnavailableError
              | InvalidPaymentError
              | InvalidParametersError
              | PaymentStakeError
              | TransferResolutionError
              | AcceptPaymentError
              | InsufficientBalanceError
              | InvalidPaymentIdError
            >(
              new AcceptPaymentError(
                `Gateway ${payment.gatewayUrl} is not currently active!`,
              ),
            );
          }

          // Get the address of HyperToken for this particular chain
          const chainInformation = config.chainInformation.get(payment.chainId);

          if (chainInformation == null) {
            return errAsync<
              Payment,
              | TransferCreationError
              | VectorError
              | BalancesUnavailableError
              | BlockchainUnavailableError
              | InvalidPaymentError
              | InvalidParametersError
              | PaymentStakeError
              | TransferResolutionError
              | AcceptPaymentError
            >(
              new AcceptPaymentError(
                `Can not accept a payment on chain ${payment.chainId}, no configuration found for HyperToken`,
              ),
            );
          }

          return this.accountRepository
            .getBalanceByAsset(
              stateChannel.channelAddress,
              chainInformation.hypertokenAddress,
            )
            .andThen((hypertokenBalance) => {
              // Check the balance and make sure you have enough HyperToken to cover it
              if (
                BigNumber.from(hypertokenBalance.freeAmount).lt(
                  payment.requiredStake,
                )
              ) {
                return errAsync<
                  PushPayment | PullPayment,
                  | TransferCreationError
                  | VectorError
                  | BalancesUnavailableError
                  | BlockchainUnavailableError
                  | InvalidPaymentError
                  | InvalidParametersError
                  | PaymentStakeError
                  | TransferResolutionError
                  | InsufficientBalanceError
                  | InvalidPaymentIdError
                >(
                  new InsufficientBalanceError(
                    "Not enough Hypertoken to cover provided payments.",
                  ),
                );
              }

              return this.paymentRepository
                .provideStake(payment.id, gatewayRegistrationInfo.address)
                .andThen((paymentsResult) => {
                  return this._refreshBalances().map(() => paymentsResult);
                });
            });
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
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
  ): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | BalancesUnavailableError
    | InvalidPaymentIdError
  > {
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext(),
    ]).andThen((vals) => {
      const [payments, context] = vals;
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync<
          void,
          | VectorError
          | BlockchainUnavailableError
          | InvalidPaymentError
          | InvalidParametersError
          | BalancesUnavailableError
        >(new InvalidParametersError("Invalid payment ID!"));
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
    | InvalidPaymentIdError
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
              return errAsync<
                Payment,
                | VectorError
                | BlockchainUnavailableError
                | InvalidPaymentError
                | InvalidParametersError
                | TransferResolutionError
              >(new InvalidParametersError("Invalid payment ID"));
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
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | ProxyError
    | BalancesUnavailableError
    | InvalidPaymentIdError
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
            | VectorError
            | BlockchainUnavailableError
            | InvalidPaymentError
            | InvalidParametersError
            | TransferCreationError
            | ProxyError
            | BalancesUnavailableError
            | InvalidPaymentIdError
          >
        >();
        for (const payment of payments.values()) {
          paymentAdvancements.push(this._advancePayment(payment, context));
        }
        return ResultUtils.combine(paymentAdvancements);
      })
      .map(() => {});
  }

  public repairPayments(
    paymentIds: PaymentId[],
  ): ResultAsync<
    Payment[],
    | BlockchainUnavailableError
    | ProxyError
    | VectorError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferResolutionError
    | InvalidPaymentIdError
  > {
    // Recover payments will work to restore a "borked" payment to a usable status.
    // First step, get the payments.
    return ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds(paymentIds),
      this.contextProvider.getInitializedContext(),
    ])
      .andThen(([paymentsById, context]) => {
        // Pull out a list of gateway connectors for the payments
        const payments = Array.from(paymentsById.values());
        const gatewayUrls = payments.reduce((prev, cur) => {
          if (!prev.includes(cur.gatewayUrl)) {
            prev.push(cur.gatewayUrl);
          }
          return prev;
        }, new Array<GatewayUrl>());

        // Get the gateways
        return ResultUtils.combine(
          gatewayUrls.map((gatewayUrl) => {
            return this.gatewayConnectorRepository.getGatewayProxy(gatewayUrl);
          }),
        ).andThen((gatewayConnectorProxies) => {
          // Let's try and repair the payments. Most of the time, the payment
          // will be in the "borked" state, but not always. I'm going to allow
          // repairs to be attempted at any state.
          return ResultUtils.combine(
            payments.map((payment) => {
              // Get the gateway proxy for the payment
              const gatewayConnector = gatewayConnectorProxies.find((proxy) => {
                return proxy.gatewayUrl == payment.gatewayUrl;
              });

              // If the proxy exists, notify the proxy
              if (gatewayConnector != null) {
                gatewayConnector.notifyRepairRequested(payment).mapErr((e) => {
                  this.logUtils.error(
                    `Could not notify the gateway ${payment.gatewayUrl} about a repair request for payment ${payment.id}`,
                  );
                });
              }
              return this._recoverPayment(payment, context);
            }),
          );
        });
      })
      .andThen(() => {
        return this.paymentRepository.getPaymentsByIds(paymentIds);
      })
      .map((paymentsById) => {
        return Array.from(paymentsById.values());
      });
  }

  public getPayment(
    paymentId: PaymentId,
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    GetPaymentResponse,
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidPaymentIdError
  > {
    return this.paymentRepository
      .getPaymentsByIds([paymentId])
      .map((paymentsById) => {
        const payment = paymentsById.get(paymentId);

        if (payment == null || payment.gatewayUrl !== gatewayUrl) {
          return new GetPaymentResponse(null, EPaymentType.Push);
        }

        if (payment instanceof PullPayment) {
          return new GetPaymentResponse(payment, EPaymentType.Pull);
        }
        if (payment instanceof PushPayment) {
          return new GetPaymentResponse(payment, EPaymentType.Push);
        }
        throw new Error(`Unknown payment type!`);
      });
  }

  protected _recoverPayment(
    payment: Payment,
    context: HypernetContext,
  ): ResultAsync<
    void,
    BlockchainUnavailableError | TransferResolutionError | VectorError
  > {
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
    payment: PushPayment | PullPayment,
    context: HypernetContext,
  ): ResultAsync<
    void,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | ProxyError
    | BalancesUnavailableError
    | TransferCreationError
    | InvalidPaymentIdError
  > {
    this.logUtils.debug(`Advancing payment ${payment.id}`);
    this.logUtils.debug(`Current payment status is ${payment.state}`);

    return this.gatewayConnectorRepository
      .getGatewayProxy(payment.gatewayUrl)
      .andThen((proxy) => {
        const gatewayConnectorStatus = proxy.getConnectorActivationStatus();
        this.logUtils.debug(
          `In _advancePayment, gatewayConnectorStatus = ${gatewayConnectorStatus}`,
        );
        if (gatewayConnectorStatus) {
          return this._advancePaymentForActivatedGateway(
            payment,
            context,
          ).andThen(() => {
            return okAsync(undefined);
          });
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
    payment: PushPayment | PullPayment,
    context: HypernetContext,
  ): ResultAsync<
    Payment,
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
    | InvalidPaymentIdError
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

  protected _validatePullPayment(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    totalAuthorized: BigNumberString,
    expirationDate: UnixTimestamp,
    deltaAmount: BigNumberString,
    deltaTime: number,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    void,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
  > {
    if (requestIdentifier == "") {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, requestIdentifier must be a non-empty string. Received ${requestIdentifier}`,
        ),
      );
    }

    if (!this.validationUtils.validatePublicIdentifier(toIdentifier)) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, toIdentifier must be a valid public identifier. Received ${toIdentifier}`,
        ),
      );
    }

    if (!this.validationUtils.validateEthereumAddress(channelAddress)) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, channelAddress must be a valid Ethereum contract address. Received ${toIdentifier}`,
        ),
      );
    }

    // The deltaTime has to be at least 1 second
    if (deltaTime < 1) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, deltaTime must be 1 or more. Received ${deltaTime}`,
        ),
      );
    }

    // Make sure the deltaAmount is at least 1 wei
    if (BigNumber.from(deltaAmount).lt(1)) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, deltaAmount must be 1 or more. Received ${deltaAmount}`,
        ),
      );
    }

    // Make sure the required stake is positive, it can be 0
    if (BigNumber.from(requiredStake).isNegative()) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, requiredStake must be positive. Received ${requiredStake}`,
        ),
      );
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.accountRepository.getBalanceByAsset(channelAddress, paymentToken),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
      this.gatewayConnectorRepository
        .getAuthorizedGateways()
        .andThen((authorizedGateways) => {
          // Make sure the gateway is authorized
          if (authorizedGateways.get(gatewayUrl) == null) {
            return errAsync(
              new InvalidParametersError(
                `When authorizing funds, gateway must be authorized! ${gatewayUrl} is not`,
              ),
            );
          }

          // Make sure the gateway is active
          return this.gatewayConnectorRepository.getGatewayProxy(gatewayUrl);
        })
        .andThen((proxy) => {
          if (!proxy.getConnectorActivationStatus()) {
          }
          return okAsync(undefined);
        }),
    ]).andThen(([config, context, balance, timestamp]) => {
      // Make sure the channel actually exists
      const activeStateChannel = context.activeStateChannels.find((val) => {
        return val.channelAddress == channelAddress;
      });

      if (activeStateChannel == null) {
        return errAsync(
          new PaymentCreationError(
            `Channel ID ${channelAddress} does not exist`,
          ),
        );
      }

      // Validate that sufficient tokens exist
      const balanceNum = BigNumber.from(balance.freeAmount);
      if (balanceNum.lt(totalAuthorized)) {
        return errAsync(
          new InsufficientBalanceError(
            `User does not have enough of token ${paymentToken} available in channel ${channelAddress} for payment`,
          ),
        );
      }

      // Make sure the expirationDate is OK
      if (expirationDate <= timestamp + config.defaultPaymentExpiryLength) {
        return errAsync(
          new InvalidParametersError(
            `When authorizing funds, expirationDate must be at least 3 days from the current block time. ${timestamp} is the current block time, provided expiration date is ${expirationDate}`,
          ),
        );
      }

      return okAsync(undefined);
    });
  }

  protected _validatePushPayment(
    gatewayUrl: GatewayUrl,
    requestIdentifier: string,
    channelAddress: EthereumContractAddress,
    toIdentifier: PublicIdentifier,
    amount: BigNumberString,
    expirationDate: UnixTimestamp,
    requiredStake: BigNumberString,
    paymentToken: EthereumContractAddress,
    metadata: string | null,
  ): ResultAsync<
    void,
    | PaymentCreationError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | BalancesUnavailableError
    | InsufficientBalanceError
    | PersistenceError
    | ProxyError
  > {
    if (requestIdentifier == "") {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, requestIdentifier must be a non-empty string. Received ${requestIdentifier}`,
        ),
      );
    }

    if (!this.validationUtils.validatePublicIdentifier(toIdentifier)) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, toIdentifier must be a valid public identifier. Received ${toIdentifier}`,
        ),
      );
    }

    if (!this.validationUtils.validateEthereumAddress(channelAddress)) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, channelAddress must be a valid Ethereum contract address. Received ${toIdentifier}`,
        ),
      );
    }

    // Make sure the required stake is positive, it can be 0
    if (BigNumber.from(requiredStake).isNegative()) {
      return errAsync(
        new InvalidParametersError(
          `When authorizing funds, requiredStake must be positive. Received ${requiredStake}`,
        ),
      );
    }

    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.accountRepository.getBalanceByAsset(channelAddress, paymentToken),
      this.blockchainTimeUtils.getBlockchainTimestamp(),
      this.gatewayConnectorRepository
        .getAuthorizedGateways()
        .andThen((authorizedGateways) => {
          // Make sure the gateway is authorized
          if (authorizedGateways.get(gatewayUrl) == null) {
            return errAsync(
              new InvalidParametersError(
                `When authorizing funds, gateway must be authorized! ${gatewayUrl} is not`,
              ),
            );
          }

          // Make sure the gateway is active
          return this.gatewayConnectorRepository.getGatewayProxy(gatewayUrl);
        })
        .andThen((proxy) => {
          if (!proxy.getConnectorActivationStatus()) {
          }
          return okAsync(undefined);
        }),
    ]).andThen(([config, context, balance, timestamp]) => {
      // Make sure the channel actually exists
      const activeStateChannel = context.activeStateChannels.find((val) => {
        return val.channelAddress == channelAddress;
      });

      if (activeStateChannel == null) {
        return errAsync(
          new PaymentCreationError(
            `Channel ID ${channelAddress} does not exist`,
          ),
        );
      }

      // Validate that sufficient tokens exist
      const balanceNum = BigNumber.from(balance.freeAmount);
      if (balanceNum.lt(amount)) {
        return errAsync(
          new InsufficientBalanceError(
            `User does not have enough of token ${paymentToken} available in channel ${channelAddress} for payment`,
          ),
        );
      }

      // Make sure the expirationDate is OK
      if (expirationDate <= timestamp + config.defaultPaymentExpiryLength) {
        return errAsync(
          new InvalidParametersError(
            `When authorizing funds, expirationDate must be at least 3 days from the current block time. ${timestamp} is the current block time, provided expiration date is ${expirationDate}`,
          ),
        );
      }

      return okAsync(undefined);
    });
  }

  // Caculates balances and update the context after that
  private _refreshBalances(): ResultAsync<
    void,
    BalancesUnavailableError | VectorError | BlockchainUnavailableError
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
