import { ResultUtils } from "@implementations/utilities";
import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository } from "@interfaces/data";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  EthereumAddress,
  Payment,
  PublicIdentifier,
  PublicKey,
  PullPayment,
  PushPayment,
  ResultAsync,
  Result,
  HypernetConfig,
  HypernetContext,
  InitializedHypernetContext,
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
  VectorError,
} from "@interfaces/objects/errors";
import { EPaymentState } from "@interfaces/types";
import { IConfigProvider, IContextProvider, ILogUtils } from "@interfaces/utilities";
import { err, errAsync, ok, okAsync } from "neverthrow";

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
   * Authorizes funds to a specified counterparty, with an amount, rate, & expiration date.
   * @param counterPartyAccount the public identifier of the counterparty to authorize funds to
   * @param totalAuthorized the total amount the counterparty is allowed to "pull"
   * @param expirationDate the latest time in which the counterparty can pull funds. This must be after the full maturation date of totalAuthorized, as calculated via deltaAmount and deltaTime.
   * @param deltaAmount The amount per deltaTime to authorize
   * @param deltaTime the number of seconds after which deltaAmount will be authorized, up to the limit of totalAuthorized.
   * @param requiredStake the amount of stake the counterparyt must put up as insurance
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public authorizeFunds(
    counterPartyAccount: PublicIdentifier,
    totalAuthorized: BigNumber,
    expirationDate: number,
    deltaAmount: string,
    deltaTime: number,
    requiredStake: BigNumber,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    // @TODO Check deltaAmount, deltaTime, totalAuthorized, and expiration date
    // totalAuthorized / (deltaAmount/deltaTime) > ((expiration date - now) + someMinimumNumDays)
    
    return this.paymentRepository.createPullPayment(counterPartyAccount,
      totalAuthorized.toString(),
      deltaTime,
      deltaAmount,
      expirationDate,
      requiredStake.toString(),
      paymentToken,
      disputeMediator
    );
  }

  public pullFunds(
    paymentId: string, 
    amount: BigNumber
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    // Pull the up the payment
    return this.paymentRepository.getPaymentsByIds([paymentId])
    .andThen((payments) => {
      const payment = payments.get(paymentId);

      // Verify that it is indeed a pull payment
      if (payment instanceof PullPayment) {
        // Verify that we're not pulling too quickly (greater than the average rate)
        if (payment.amountTransferred.add(amount).gt(payment.vestedAmount)) {
          return errAsync(new InvalidParametersError(`Amount of ${amount} exceeds the vested payment amount of ${payment.vestedAmount}`))
        }

        // Verify that the amount we're trying to pull does not exceed the total authorized amount
        if (payment.amountTransferred.add(amount).gt(payment.authorizedAmount)) {
          return errAsync(new InvalidParametersError(`Amount of ${amount} exceeds the total authorized amount of ${payment.authorizedAmount}`))
        }

        // Create the PullRecord
        return this.paymentRepository.createPullRecord(
          paymentId,
          amount.toString()
        );
      } else {
        return errAsync(new InvalidParametersError("Can not pull funds from a non pull payment"));
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
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public sendFunds(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: number,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, Error> {
    // TODO: Sanity checking on the values
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
  ): ResultAsync<void, LogicalError | RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    return prerequisites.andThen((vals) => {
      const [payments, context] = vals;

      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(new LogicalError(`PaymentService:offerReceived():Could not get payment!`));
      }

      if (payment.state !== EPaymentState.Proposed) {
        // The payment has already moved forward, somehow.
        // We don't need to do anything, we probably got called
        // by another instance of the core.
        return okAsync(undefined);
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

      return okAsync(undefined);
    });
  }

  /**
   * For each paymentID provided, attempts to accept funds (ie: provide a stake) for that payment.
   * @param paymentIds a list of paymentIds for which to accept funds for
   */
  public acceptOffers(
    paymentIds: string[],
  ): ResultAsync<Result<Payment, AcceptPaymentError>[], InsufficientBalanceError | AcceptPaymentError> {
    const prerequisites = ResultUtils.combine([
      this.configProvider.getConfig(),
      this.paymentRepository.getPaymentsByIds(paymentIds),
    ]);

    let config: HypernetConfig;
    let payments: Map<string, Payment>;

    return prerequisites
      .andThen((vals) => {
        [config, payments] = vals;

        return this.accountRepository.getBalanceByAsset(config.hypertokenAddress);
      })
      .andThen((hypertokenBalance) => {
        // For each payment ID, call the singular version of acceptOffers
        // Wrap each one as a Result object, and return an array of Results
        let totalStakeRequired = BigNumber.from(0);
        // First, verify to make sure that we have enough hypertoken to cover the insurance collectively
        for (const [key, payment] of payments) {
          if (payment.state !== EPaymentState.Proposed) {
            return errAsync(
              new AcceptPaymentError(`Cannot accept payment ${payment.id}, it is not in the Proposed state`),
            );
          }

          totalStakeRequired = totalStakeRequired.add(BigNumber.from(payment.requiredStake));
        }

        // Check the balance and make sure you have enough HyperToken to cover it
        if (hypertokenBalance.freeAmount.lt(totalStakeRequired)) {
          return errAsync(new InsufficientBalanceError("Not enough Hypertoken to cover provided payments."));
        }

        // Now that we know we can (probably) make the payments, let's try
        const stakeAttempts = new Array<Promise<Result<Payment, AcceptPaymentError>>>();
        for (const paymentId of paymentIds) {
          this.logUtils.log(`PaymentService:acceptOffers: attempting to provide stake for payment ${paymentId}`);

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
  public stakePosted(
    paymentId: string,
  ): ResultAsync<void, CoreUninitializedError | OfferMismatchError | InvalidParametersError> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    let payments: Map<string, Payment>;
    let context: InitializedHypernetContext;

    return prerequisites.andThen((vals) => {
      [payments, context] = vals;

      const payment = payments.get(paymentId);

      this.logUtils.log(`${paymentId}: ${JSON.stringify(payment)}`)

      if (payment == null) {
        this.logUtils.error(`Invalid payment ID: ${paymentId}`)
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Let the UI know we got an insurance transfer
      if (payment instanceof PushPayment) {
        context.onPushPaymentUpdated.next(payment);
      }
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      // Notified the UI, move on to advancing the state of the payment.
      // Payment state must be in "staked" in order to progress
      if (payment.state !== EPaymentState.Staked) {
        this.logUtils.error(`Invalid payment ${paymentId}, it must be in the staked status. Cannot provide payment!`)
        return errAsync(
          new InvalidParametersError(
            `Invalid payment ${paymentId}, it must be in the staked status. Cannot provide payment!`,
          ),
        );
      }

      // If we created the stake, we can ignore this
      if (payment.from !== context.publicIdentifier) {
        this.logUtils.log("Not providing asset since payment is not from us!");
        return okAsync(undefined);
      }

      // If the payment state is staked, we know that the proper
      // insurance has been posted.
      this.logUtils.log(`Providing asset for paymentId ${paymentId}`)
      return this.paymentRepository.provideAsset(paymentId).andThen((updatedPayment) => {
        if (updatedPayment instanceof PushPayment) {
          this.logUtils.log('Providing asset for pushpayment.')
          context.onPushPaymentUpdated.next(updatedPayment);
        }
        if (updatedPayment instanceof PullPayment) {
          this.logUtils.log('Providing asset for pullpayment.')
          context.onPullPaymentUpdated.next(updatedPayment);
        }
        return okAsync(undefined);
      });
    });
  }

  /**
   * Notifies the service that the parameterized payment has been created.
   * Called by the reciever of a parameterized transfer, AFTER they have put up stake,
   * and after the sender has created the Parameterized transfer
   * @param paymentId the payment ID to accept/resolve
   */
  public paymentPosted(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    let payments: Map<string, Payment>;
    let context: InitializedHypernetContext;

    return prerequisites.andThen((vals) => {
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
        return okAsync(undefined);
      }

      // If the payment state is approved, we know that it matches our insurance payment
      if (payment instanceof PushPayment) {
        // Resolve the parameterized payment immediately for the full balnce
        return this.paymentRepository
          .finalizePayment(paymentId, payment.paymentAmount.toString())
          .map((finalizedPayment) => {
            context.onPushPaymentUpdated.next(finalizedPayment as PushPayment);
          });
      } else if (payment instanceof PullPayment) {
        // Notify the user that the funds have been approved.
        context.onPullPaymentApproved.next(payment);
      }
      return okAsync(undefined);
    });
  }

  /**
   * Notifies the service that the parameterized payment has been resolved.
   * @param paymentId the payment id that has been resolved.
   */
  public paymentCompleted(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getInitializedContext(),
    ]);

    let payments: Map<string, Payment>;
    let context: InitializedHypernetContext;

    return prerequisites.andThen((vals) => {
      [payments, context] = vals;
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // @todo: check that the payment is TO us
      // @todo add some additional checking here
      // @todo add in a way to grab the resolved transfer
      // @todo probably resolve the offer and/or insurance transfer as well?
      // @todo probably genericize this so that it doesn't have to be a pushPayment
      context.onPushPaymentReceived.next(payment as PushPayment);

      return okAsync(undefined);
    });
  }

  /**
   * Notifies the service that a pull-payment has been recorded.
   * @param paymentId the paymentId for the pull-payment
   */
  public pullRecorded(paymentId: string): ResultAsync<void, InvalidParametersError> {
    const prerequisites = ResultUtils.combine([
      this.paymentRepository.getPaymentsByIds([paymentId]),
      this.contextProvider.getContext(),
    ]);

    let payments: Map<string, Payment>;
    let context: HypernetContext;

    return prerequisites.andThen((vals) => {
      [payments, context] = vals;
      const payment = payments.get(paymentId);

      if (payment == null) {
        return errAsync(new InvalidParametersError("Invalid payment ID!"));
      }

      // Notify the world that this pull payment was updated
      if (payment instanceof PullPayment) {
        context.onPullPaymentUpdated.next(payment);
      }

      return okAsync(undefined);
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
