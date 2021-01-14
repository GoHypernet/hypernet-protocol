import { NodeError } from "@connext/vector-types";
import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository } from "@interfaces/data";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  EthereumAddress,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PublicKey,
  PullPayment,
  PushPayment,
  ResultAsync,
  Result,
  HypernetConfig,
  HypernetContext,
} from "@interfaces/objects";
import {
  AcceptPaymentError,
  CoreUninitializedError,
  InsufficientBalanceError,
  InvalidParametersError,
  InvalidPaymentError,
  LogicalError,
  OfferMismatchError,
  RouterChannelUnknownError,
} from "@interfaces/objects/errors";
import { EPaymentState } from "@interfaces/types";
import { IConfigProvider, IContextProvider, ILogUtils } from "@interfaces/utilities";
import { combine, Err, err, errAsync, Ok, ok, okAsync } from "neverthrow";

/**
 * PaymentService uses Vector internally to send payments on the requested channel.
 * The order of operations for sending funds is as follows:
 * sendFunds() is called by sender, which creates a Message transfer with Vector, which triggers
 * offerReceived() on the recipient side, which tosses an event up to the user, who then calls
 * acceptFunds() to accept the sender's funds, which creates an Insurance transfer with Vector, which triggers
 * stakePosted() on the sender's side, which finally creates the Parameterized transfer with Vector, which triggers
 * paymentPosted() on the recipient's side, which finalizes/resolves the vector parameterized transfer.
 *
 * Note that the general expected order of operations is mirrored by the ordering of functions within this class.
 *
 * @todo we should also finalize the insurance transfer, and maybe finalize the offer transfer
 */
export class PaymentService implements IPaymentService {
  /**
   * Creates an instanceo of the paymentService.
   */
  constructor(
    protected linkRepository: ILinkRepository,
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
    protected paymentRepository: IPaymentRepository,
    protected logUtils: ILogUtils,
  ) {}

  /**
   * Sends a payment to the specified recipient.
   * Internally, creates a null/message/offer transfer to communicate
   * with the counterparty and signal a request for a stake.
   * @param counterPartyAccount the intended recipient
   * @param amount the amount of payment to send
   * @param expirationDate the expiration date at which point this payment will revert
   * @param requiredStake the amount of insurance the counterparty should put up
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, Error> {
    return this.paymentRepository.createPushPayment(
      counterPartyAccount,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );
  }

  /**
   * Called when someone has sent us a payment offer.
   * Lookup the transfer, and convert it to a payment.
   * Then, publish an RXJS event to the user.
   * @param paymentId the paymentId for the offer
   */
  public offerReceived(
    paymentId: string,
  ): ResultAsync<void, LogicalError | RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    const prerequisites = (combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [Map<string, Payment>, InitializedHypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    return prerequisites
      .andThen((vals) => {
        const [payments, context] = vals;

        const payment = payments.get(paymentId);

        if (payment == null) {
          return errAsync(new LogicalError(`PaymentService:offerReceived():Could not get payment!`));
        }

        if (payment.state !== EPaymentState.Proposed) {
          // The payment has already moved forward, somehow.
          // We don't need to do anything, we probably got called
          // by another instance of the core.
          return okAsync(null);
        }

        // Payment state is 'Proposed', continue to handle

        if (payment instanceof PushPayment) {
          // Someone wants to send us a pushPayment, emit up to the api
          context.onPushPaymentProposed.next(payment);
        } else if (payment instanceof PullPayment) {
          // Someone wants to send us a pullPayment, emit up to the api
          context.onPullPaymentProposed.next(payment);
        } else {
          throw new Error("Unknown payment type!");
        }

        return okAsync(null);
      })
      .map(() => {
        return;
      });
  }

  /**
   * For each paymentID provided, attempts to accept funds (ie: provide a stake) for that payment.
   * @param paymentIds a list of paymentIds for which to accept funds for
   */
  public acceptFunds(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    const prerequisites = (combine([
      this.configProvider.getConfig(),
      this.paymentRepository.getPaymentsByIds(paymentIds) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [HypernetConfig, Map<string, Payment>],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let config: HypernetConfig;
    let payments: Map<string, Payment>;

    return prerequisites
      .andThen((vals) => {
        [config, payments] = vals;

        return this.accountRepository.getBalanceByAsset(config.hypertokenAddress);
      })
      .andThen((hypertokenBalance) => {
        // For each payment ID, call the singular version of acceptFunds
        // Wrap each one as a Result object, and return an array of Results
        let totalStakeRequired = BigNumber.from(0);
        // First, verify to make sure that we have enough hypertoken to cover the insurance collectively
        payments.forEach((payment) => {
          if (payment.state !== EPaymentState.Proposed) {
            return errAsync(
              new AcceptPaymentError(`Cannot accept payment ${payment.id}, it is not in the Proposed state`),
            );
          }

          totalStakeRequired = totalStakeRequired.add(BigNumber.from(payment.requiredStake));
        });

        // Check the balance and make sure you have enough HyperToken to cover it
        if (hypertokenBalance.freeAmount < totalStakeRequired) {
          return errAsync(new InsufficientBalanceError("Not enough Hypertoken to cover provided payments."));
        }

        // Now that we know we can (probably) make the payments, let's try
        const stakeAttempts = [];
        for (const paymentId of paymentIds) {
          this.logUtils.log(`PaymentService:acceptFunds: attempting to provide stake for payment ${paymentId}`);

          const stakeAttempt = this.paymentRepository.provideStake(paymentId).match(
            (payment) => {
              return ok(payment) as Result<Payment, AcceptPaymentError>;
            },
            (e) => {
              return err(
                new AcceptPaymentError(`Payment ${paymentId} could not be staked! Source exception: ${e}`),
              ) as Result<Payment, AcceptPaymentError>;
            },
          );

          stakeAttempts.push(stakeAttempt);
        }
        return ResultAsync.fromPromise(Promise.all(stakeAttempts));
      });
  }

  /**
   * Notifies the service that a stake has been posted; if verified,
   * then provides assets to the counterparty (ie a parameterizedPayment)
   * @param paymentId the paymentId for the stake
   */
  public stakePosted(paymentId: string): ResultAsync<void, OfferMismatchError | InvalidParametersError> {
    const prerequisites = (combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [Map<string, Payment>, HypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let payments: Map<string, Payment>;
    let context: HypernetContext;

    return prerequisites
      .andThen((vals) => {
        [payments, context] = vals;

        const payment = payments.get(paymentId);

        if (payment == null) {
          return errAsync(new InvalidParametersError("Invalid payment ID!"));
        }

        // Make sure the stake is legit
        if (!payment.requiredStake.eq(payment.amountStaked)) {
          // TODO: We should be doing more here. The whole payment should be aborted.
          return errAsync(new OfferMismatchError(`Invalid stake provided for payment ${paymentId}`));
        }

        // Payment state must be in "staked" in order to progress
        if (payment.state !== EPaymentState.Staked) {
          return errAsync(
            new InvalidParametersError(
              `Invalid payment ${paymentId}, it must be in the staked status. Cannot provide payment!`,
            ),
          );
        }

        // If we created the stake, we can ignore this
        if (payment.from !== context.publicIdentifier) {
          this.logUtils.log("Not providing asset since payment is not from us!");
          return okAsync(null);
        }

        // If the payment state is staked, we know that the proper
        // insurance has been posted.
        return this.paymentRepository.provideAsset(paymentId).andThen((updatedPayment) => {
          if (updatedPayment instanceof PushPayment) {
            context.onPushPaymentUpdated.next(updatedPayment);
          }
          if (updatedPayment instanceof PullPayment) {
            context.onPullPaymentUpdated.next(updatedPayment);
          }
          return okAsync(null);
        });
      })
      .map(() => {
        return;
      });
  }

  /**
   * Notifies the service that the parameterized payment has been created.
   * Called by the reciever of a parameterized transfer, AFTER they have put up stake,
   * and after the sender has created the Parameterized transfer
   * @param paymentId the payment ID to accept/resolve
   */
  public paymentPosted(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = (combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [Map<string, Payment>, HypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let payments: Map<string, Payment>;
    let context: HypernetContext;

    return prerequisites
      .andThen((vals) => {
        [payments, context] = vals;
        const payment = payments.get(paymentId);

        if (payment == null) {
          return errAsync(new InvalidParametersError("Invalid payment ID!"));
        }

        // Payment state must be in "approved" to finalize
        if (payment.state !== EPaymentState.Approved) {
          return errAsync(
            new InvalidParametersError(
              `Invalid payment ${paymentId}, it must be in the approved status. Cannot provide payment!`,
            ),
          );
        }

        // Make sure the stake is legit
        // if (!payment.requiredStake.eq(payment.amountStaked)) {
        //   // TODO: We should be doing more here. The whole payment should be aborted.
        //   return errAsync(new OfferMismatchError(`Invalid stake provided for payment ${paymentId}`));
        // }

        // If we're the ones that *sent* the payment, we can ignore this
        if (payment.from === context.publicIdentifier) {
          this.logUtils.log("Doing nothing in paymentPosted because we are the ones that posted the payment!");
          return okAsync(null);
        }

        // If the payment state is approved, we know that it matches our insurance payment
        if (payment instanceof PushPayment) {
          // Resolve the parameterized payment immediately for the full balnce
          return this.paymentRepository.finalizePayment(paymentId, payment.paymentAmount.toString()).map(() => {
            return null;
          });
        } else if (payment instanceof PullPayment) {
          // Notify the user that the funds have been approved.
          context.onPullPaymentApproved.next(payment);
        }
        return okAsync(null);
      })
      .map(() => {
        return;
      });
  }

  /**
   * Notifies the service that the parameterized payment has been resolved.
   * @param paymentId the payment id that has been resolved.
   */
  public paymentCompleted(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = (combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [Map<string, Payment>, HypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let payments: Map<string, Payment>;
    let context: HypernetContext;

    return prerequisites
      .andThen((vals) => {
        [payments, context] = vals;
        const payment = payments.get(paymentId);

        if (payment == null) {
          return errAsync(new InvalidParametersError("Invalid payment ID!"));
        }

        // @todo add some additional checking here
        // @todo add in a way to grab the resolved transfer
        // @todo probably resolve the offer and/or insurance transfer as well?
        // @todo probably genericize this so that it doesn't have to be a pushPayment
        context.onPushPaymentReceived.next(payment as PushPayment);

        return okAsync(null);
      })
      .map(() => {
        return;
      });
  }

  /**
   * Notifies the service that a pull-payment has been recorded.
   * @param paymentId the paymentId for the pull-payment
   */
  public pullRecorded(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = (combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [Map<string, Payment>, HypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let payments: Map<string, Payment>;
    let context: HypernetContext;

    return prerequisites.andThen((vals) => {
      [payments, context] = vals;
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      return errAsync(new Error("Method not yet implemented"));
    });
  }

  /**
   * Requests a payment on the specified channel.
   * @param channelId the (Vector) channelId to request the payment on
   * @param amount the amount of payment to request
   */
  requestPayment(channelId: string, amount: string): Promise<Payment> {
    throw new Error("Method not implemented.");
  }
}
