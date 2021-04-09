import {
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  SortedTransfers,
  IFullTransferState,
  PaymentId,
} from "@hypernetlabs/objects";
import { EPaymentState, EPaymentType, ETransferType } from "@hypernetlabs/objects";
import {
  InvalidParametersError,
  InvalidPaymentError,
  LogicalError,
  VectorError,
  InvalidPaymentIdError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPaymentUtils {
  /**
   *
   * @param paymentId
   */
  isHypernetDomain(paymentId: PaymentId): ResultAsync<boolean, InvalidPaymentIdError>;

  /**
   * Creates a PaymentId by combining
   * @param paymentType
   */
  createPaymentId(paymentType: EPaymentType): ResultAsync<PaymentId, InvalidParametersError>;

  sortTransfers(
    _paymentId: PaymentId,
    transfers: IFullTransferState[],
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError | LogicalError>;

  /**
   *
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  transfersToPayments(
    transfers: IFullTransferState[],
  ): ResultAsync<Payment[], VectorError | LogicalError | InvalidPaymentError | InvalidParametersError>;

  /**
   *
   * @param fullPaymentId
   * @param transfers
   * @param config
   * @param browserNode
   */
  transfersToPayment(
    fullPaymentId: PaymentId,
    transfers: IFullTransferState[],
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>;

  /**
   *
   * @param transfer
   */
  getTransferType(transfer: IFullTransferState): ResultAsync<ETransferType, LogicalError | VectorError>;

  getTransferTypeWithTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<{ transferType: ETransferType; transfer: IFullTransferState }, VectorError | LogicalError>;

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
  ): ResultAsync<PullPayment, LogicalError>;

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
  ): ResultAsync<PushPayment, LogicalError>;

  /**
   * Given an unsorted list of transfers, it will give you the timestamp of the
   * earliest one.
   * @param transfers an unsorted list of transfers
   * @returns the unix timestamp of the earliest transfer
   */
  getEarliestDateFromTransfers(transfers: IFullTransferState[]): number;
  getPaymentState(sortedTransfers: SortedTransfers): EPaymentState;
}
