import { BrowserNode } from "@connext/vector-browser-node";
import { FullTransferState, NodeError, NodeResponses } from "@connext/vector-types";
import { IPaymentRepository } from "@interfaces/data/IPaymentRepository";
import {
  BigNumber,
  EthereumAddress,
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PublicKey,
  PullPayment,
  PushPayment,
  ResultAsync,
} from "@interfaces/objects";
import {
  CoreUninitializedError,
  LogicalError,
  PaymentFinalizeError,
  PaymentStakeError,
  RouterChannelUnknownError,
  TransferResolutionError,
} from "@interfaces/objects/errors";
import { EPaymentType, ETransferType } from "@interfaces/types";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  ILogUtils,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import moment from "moment";
import { combine, errAsync, okAsync } from "neverthrow";

/**
 * Contains methods for creating push, pull, etc payments,
 * as well as retrieving them, and finalizing them.
 */
export class PaymentRepository implements IPaymentRepository {
  /**
   * Returns an instance of PaymentRepository
   */
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected vectorUtils: IVectorUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected paymentUtils: IPaymentUtils,
    protected logUtils: ILogUtils,
  ) {}

  /**
   * Creates a push payment and returns it. Nothing moves until
   * the payment is accepted; the payment will return with the
   * "PROPOSED" status. This function just creates an OfferTransfer.
   * @param counterPartyAccount the public identifier of the account to pay
   * @param amount the amount to pay the counterparty
   * @param expirationDate the date (in unix time) at which point the payment will expire & revert
   * @param requiredStake the amount of insurance the counterparty must put up for this payment
   * @param paymentToken the (Ethereum) address of the payment token
   * @param disputeMediator the (Ethereum) address of the dispute mediator
   */
  public createPushPayment(
    counterPartyAccount: PublicIdentifier,
    amount: string,
    expirationDate: moment.Moment,
    requiredStake: string,
    paymentToken: EthereumAddress,
    disputeMediator: PublicKey,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, InitializedHypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let paymentId: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, context] = vals;
        return this.paymentUtils.createPaymentId(EPaymentType.Push);
      })
      .andThen((myPaymentId) => {
        paymentId = myPaymentId;
        const message: IHypernetTransferMetadata = {
          paymentId,
          creationDate: moment().unix(),
          to: counterPartyAccount,
          from: context.publicIdentifier,
          requiredStake: requiredStake.toString(),
          paymentAmount: amount.toString(),
          expirationDate: expirationDate.unix(),
          paymentToken,
          disputeMediator,
        };

        // Create a message transfer, with the terms of the payment in the metadata.
        return this.vectorUtils.createMessageTransfer(counterPartyAccount, message);
      })
      .andThen((transferInfo) => {
        return ResultAsync.fromPromise(browserNode.getTransfer({ transferId: transferInfo.transferId }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((transferResult) => {
        if (transferResult.isError) {
          return errAsync(transferResult.getError() as NodeError);
        }

        const transfer = transferResult.getValue() as FullTransferState;

        // Return the payment
        return this.paymentUtils.transfersToPayment(paymentId, [transfer], config, browserNode);
      });
  }

  /**
   * Given a paymentId, return the component transfers.
   * @param paymentId the payment to get transfers for
   */
  protected _getTransfersByPaymentId(paymentId: string): ResultAsync<FullTransferState[], Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.vectorUtils.getRouterChannelAddress(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, string, HypernetConfig, InitializedHypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let browserNode: BrowserNode;
    let channelAddress: string;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;

    return prerequisites
      .andThen((vals) => {
        [browserNode, channelAddress, config, context] = vals;
        return ResultAsync.fromPromise(browserNode.getActiveTransfers({ channelAddress }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((activeTransfersRes) => {
        if (activeTransfersRes.isError) {
          this.logUtils.log("PaymentRepository: getPaymentsByIds: Error getting active transfers");
          return errAsync(activeTransfersRes.getError() as NodeError);
        }

        const transferTypeResults = new Array<
          ResultAsync<
            {
              transferType: ETransferType;
              transfer: FullTransferState;
            },
            NodeError | Error
          >
        >();
        for (const transfer of activeTransfersRes.getValue()) {
          transferTypeResults.push(this.paymentUtils.getTransferTypeWithTransfer(transfer, browserNode));
        }

        return combine(transferTypeResults);
      })
      .andThen((tranferTypesWithTransfersRes) => {
        const tranferTypesWithTransfers = tranferTypesWithTransfersRes as {
          transferType: ETransferType;
          transfer: FullTransferState;
        }[];
        // For each transfer, we are either just going to know it's relevant
        // from the data in the metadata, or we are going to check if it's an
        // insurance payment and we have more bulletproof ways to check
        const relevantTransfers: FullTransferState[] = [];
        for (const transferTypeWithTransfer of tranferTypesWithTransfers) {
          const { transferType, transfer } = transferTypeWithTransfer;

          if (transfer.meta && paymentId === transfer.meta.paymentId) {
            relevantTransfers.push(transfer);
          } else {
            if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
              if (paymentId === transfer.transferState.UUID) {
                relevantTransfers.push(transfer);
              } else {
                this.logUtils.log(`Transfer not relevant in PaymentRepository, transferId: ${transfer.transferId}`);
              }
            } else {
              this.logUtils.log(`Unrecognized transfer in PaymentRepository, transferId: ${transfer.transferId}`);
            }
          }
        }

        return okAsync(relevantTransfers);
      });
  }

  /**
   * Given a list of payment Ids, return the associated payments.
   * @param paymentIds the list of payments to get
   */
  public getPaymentsByIds(paymentIds: string[]): ResultAsync<Map<string, Payment>, Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.vectorUtils.getRouterChannelAddress(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, string, HypernetConfig, InitializedHypernetContext],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let browserNode: BrowserNode;
    let channelAddress: string;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;

    return prerequisites
      .andThen((vals) => {
        [browserNode, channelAddress, config, context] = vals;

        return ResultAsync.fromPromise(browserNode.getActiveTransfers({ channelAddress }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((activeTransfersRes) => {
        if (activeTransfersRes.isError) {
          this.logUtils.log("PaymentRepository: getPaymentsByIds: Error getting active transfers");
          return errAsync(activeTransfersRes.getError() as NodeError);
        }

        const transferTypeResults = new Array<
          ResultAsync<
            {
              transferType: ETransferType;
              transfer: FullTransferState;
            },
            NodeError | Error
          >
        >();
        for (const transfer of activeTransfersRes.getValue()) {
          transferTypeResults.push(this.paymentUtils.getTransferTypeWithTransfer(transfer, browserNode));
        }

        return combine(transferTypeResults);
      })
      .andThen((tranferTypesWithTransfersRes) => {
        const tranferTypesWithTransfers = tranferTypesWithTransfersRes as {
          transferType: ETransferType;
          transfer: FullTransferState;
        }[];
        // For each transfer, we are either just going to know it's relevant
        // from the data in the metadata, or we are going to check if it's an
        // insurance payment and we have more bulletproof ways to check
        const relevantTransfers: FullTransferState[] = [];
        for (const transferTypeWithTransfer of tranferTypesWithTransfers) {
          const { transferType, transfer } = transferTypeWithTransfer;

          if (transfer.meta && paymentIds.includes(transfer.meta.paymentId)) {
            relevantTransfers.push(transfer);
          } else {
            if (transferType === ETransferType.Insurance || transferType === ETransferType.Parameterized) {
              if (paymentIds.includes(transfer.transferState.UUID)) {
                relevantTransfers.push(transfer);
              } else {
                this.logUtils.log(`Transfer not relevant in PaymentRepository, transferId: ${transfer.transferId}`);
              }
            } else {
              this.logUtils.log(`Unrecognized transfer in PaymentRepository, transferId: ${transfer.transferId}`);
            }
          }
        }

        return okAsync(relevantTransfers);
      })
      .andThen((relevantTransfers) => {
        return this.paymentUtils.transfersToPayments(relevantTransfers, config, context, browserNode);
      })
      .map((payments) => {
        return payments.reduce((map, obj) => {
          map.set(obj.id, obj);
          return map;
        }, new Map<string, Payment>());
      });
  }

  /**
   * Finalizes/confirms a payment
   * Internally, this is what actually calls resolve() on the Vector transfer -
   * be it a insurancePayments or parameterizedPayments.
   * @param paymentId the payment to finalize
   * @param amount the amount of the payment to finalize for
   */
  public finalizePayment(
    paymentId: string,
    amount: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this._getTransfersByPaymentId(paymentId) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, FullTransferState[]],
      | PaymentFinalizeError
      | TransferResolutionError
      | RouterChannelUnknownError
      | CoreUninitializedError
      | NodeError
      | Error
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let existingTransfers: FullTransferState[];
    let parameterizedTransferId: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, existingTransfers] = vals;

        this.logUtils.log(`Finalizing payment ${paymentId}`);

        // get the transfer id from the paymentId
        // use payment utils for this
        return this.paymentUtils.sortTransfers(paymentId, existingTransfers, browserNode);
      })
      .andThen((sortedTransfers) => {
        if (sortedTransfers.parameterizedTransfer == null) {
          return errAsync(
            new PaymentFinalizeError(
              `Cannot finalize payment ${paymentId}, no parameterized transfer exists for this!`,
            ),
          );
        }

        parameterizedTransferId = sortedTransfers.parameterizedTransfer.transferId;

        return this.vectorUtils.resolvePaymentTransfer(parameterizedTransferId, paymentId, amount);
      })
      .andThen((res) => {
        return ResultAsync.fromPromise(
          browserNode.getTransfer({
            transferId: parameterizedTransferId,
          }),
          (e) => {
            return e as NodeError;
          },
        );
      })
      .andThen((transferResult) => {
        if (transferResult.isError) {
          return errAsync(transferResult.getError() as NodeError);
        }

        const transfer = transferResult.getValue() as FullTransferState;

        // Remove the parameterized payment
        existingTransfers = existingTransfers.filter((obj) => obj.transferId !== parameterizedTransferId);
        existingTransfers.push(transfer);

        // Transfer has been resolved successfully; return the updated payment.
        const updatedPayment = this.paymentUtils.transfersToPayment(paymentId, existingTransfers, config, browserNode);

        return updatedPayment;
      });
  }

  /**
   * Provides stake for a given payment id
   * Internally, this is what actually creates the InsurancePayments with Vector.
   * @param paymentId the payment for which to provide stake for
   */
  public provideStake(
    paymentId: string,
  ): ResultAsync<
    Payment,
    PaymentStakeError | TransferResolutionError | RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  > {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this._getTransfersByPaymentId(paymentId) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, FullTransferState[]],
      | PaymentFinalizeError
      | TransferResolutionError
      | RouterChannelUnknownError
      | CoreUninitializedError
      | NodeError
      | Error
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let existingTransfers: FullTransferState[];

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, existingTransfers] = vals;

        return this.paymentUtils.transfersToPayment(paymentId, existingTransfers, config, browserNode);
      })
      .andThen((payment) => {
        const paymentMediator = payment.disputeMediator;
        const paymentSender = payment.from;
        const paymentID = payment.id;
        const paymentStart = `${Math.floor(moment.now() / 1000)}`;
        const paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`;

        // TODO: There are probably some logical times when you should not provide a stake
        if (false) {
          return errAsync(new PaymentStakeError());
        }

        this.logUtils.log(`PaymentRepository:provideStake: Creating insurance transfer for paymentId: ${paymentId}`);
        return this.vectorUtils.createInsuranceTransfer(
          paymentSender,
          paymentMediator,
          payment.requiredStake,
          paymentExpiration,
          paymentID,
        );
      })
      .andThen((transferInfoUnk) => {
        const transferInfo = transferInfoUnk as NodeResponses.ConditionalTransfer;
        return ResultAsync.fromPromise(browserNode.getTransfer({ transferId: transferInfo.transferId }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((transferResult) => {
        if (transferResult.isError) {
          return errAsync(transferResult.getError() as NodeError);
        }

        const transfer = transferResult.getValue() as FullTransferState;
        const allTransfers = [transfer, ...existingTransfers];

        // Transfer has been created successfully; return the updated payment.
        return this.paymentUtils.transfersToPayment(paymentId, allTransfers, config, browserNode);
      });
  }

  /**
   * Singular version of provideAssets
   * Internally, creates a parameterizedPayment with Vector,
   * and returns a payment of state 'Approved'
   * @param paymentId the payment for which to provide an asset for
   */
  public provideAsset(
    paymentId: string,
  ): ResultAsync<Payment, RouterChannelUnknownError | CoreUninitializedError | NodeError | LogicalError> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this._getTransfersByPaymentId(paymentId) as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, FullTransferState[]],
      | PaymentFinalizeError
      | TransferResolutionError
      | RouterChannelUnknownError
      | CoreUninitializedError
      | NodeError
      | LogicalError
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let existingTransfers: FullTransferState[];

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, existingTransfers] = vals;

        return this.paymentUtils.transfersToPayment(paymentId, existingTransfers, config, browserNode);
      })
      .andThen((payment) => {
        const paymentTokenAddress = payment.paymentToken;
        let paymentTokenAmount: BigNumber;
        if (payment instanceof PushPayment) {
          paymentTokenAmount = payment.paymentAmount;
        } else if (payment instanceof PullPayment) {
          paymentTokenAmount = payment.authorizedAmount;
        } else {
          return errAsync(new LogicalError());
        }
        const paymentRecipient = payment.to;
        const paymentID = payment.id;
        const paymentStart = `${Math.floor(moment.now() / 1000)}`;
        const paymentExpiration = `${paymentStart + config.defaultPaymentExpiryLength}`;

        // Use vectorUtils to create the parameterizedPayment
        return this.vectorUtils.createPaymentTransfer(
          payment instanceof PushPayment ? EPaymentType.Push : EPaymentType.Pull,
          paymentRecipient,
          paymentTokenAmount,
          paymentTokenAddress,
          paymentID,
          paymentStart,
          paymentExpiration,
        );
      })
      .andThen((transferInfoUnk) => {
        const transferInfo = transferInfoUnk as NodeResponses.ConditionalTransfer;
        return ResultAsync.fromPromise(browserNode.getTransfer({ transferId: transferInfo.transferId }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((transferResult) => {
        if (transferResult.isError) {
          return errAsync(transferResult.getError() as NodeError);
        }

        const transfer = transferResult.getValue() as FullTransferState;
        const allTransfers = [transfer, ...existingTransfers];

        // Transfer has been created successfully; return the updated payment.
        return this.paymentUtils.transfersToPayment(paymentId, allTransfers, config, browserNode);
      });
  }
}
