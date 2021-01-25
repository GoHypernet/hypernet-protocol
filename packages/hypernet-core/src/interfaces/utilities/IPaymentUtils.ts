import {
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  SortedTransfers,
  ResultAsync,
} from "@interfaces/objects";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { InvalidParametersError, InvalidPaymentError, LogicalError, VectorError } from "@interfaces/objects/errors";
import { IBrowserNode, IFullTransferState } from "./IBrowserNode";

export interface IPaymentUtils {
  /**
   *
   * @param paymentId
   */
  isHypernetDomain(paymentId: string): ResultAsync<boolean, Error>;

  /**
   * Creates a PaymentId by combining
   * @param paymentType
   */
  createPaymentId(paymentType: EPaymentType): ResultAsync<string, Error>;

  sortTransfers(
    _paymentId: string,
    transfers: IFullTransferState[],
    browserNode: IBrowserNode,
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError | Error>;

  /**
   *
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  transfersToPayments(
    transfers: IFullTransferState[],
    config: HypernetConfig,
    context: InitializedHypernetContext,
    browserNode: IBrowserNode,
  ): ResultAsync<Payment[], InvalidPaymentError>;

  /**
   *
   * @param fullPaymentId
   * @param transfers
   * @param config
   * @param browserNode
   */
  transfersToPayment(
    fullPaymentId: string,
    transfers: IFullTransferState[],
    config: HypernetConfig,
    browserNode: IBrowserNode,
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>;

  /**
   *
   * @param transfer
   */
  getTransferType(
    transfer: IFullTransferState,
    browserNode: IBrowserNode,
  ): ResultAsync<ETransferType, LogicalError | VectorError>;

  getTransferTypeWithTransfer(
    transfer: IFullTransferState,
    browserNode: IBrowserNode,
  ): ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | Error>;

  /**
   *
   * @param id
   * @param to
   * @param from
   * @param state
   * @param sortedTransfers
   * @param metadata
   */
  transfersToPullPayment(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): ResultAsync<PullPayment, Error>;

  /**
   *
   * @param id
   * @param to
   * @param from
   * @param state
   * @param sortedTransfers
   * @param metadata
   */
  transfersToPushPayment(
    id: string,
    to: PublicIdentifier,
    from: PublicIdentifier,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
    metadata: IHypernetTransferMetadata,
  ): ResultAsync<PushPayment, Error>;
}
