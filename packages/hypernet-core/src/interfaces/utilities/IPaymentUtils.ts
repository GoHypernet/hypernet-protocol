import {
  Payment,
  PullPayment,
  PushPayment,
  SortedTransfers,
  IFullTransferState,
  PaymentId,
  UnixTimestamp,
  EPaymentState,
  EPaymentType,
  InvalidParametersError,
  InvalidPaymentError,
  LogicalError,
  VectorError,
  InvalidPaymentIdError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPaymentUtils {
  /**
   *
   * @param paymentId
   */
  isHypernetDomain(
    paymentId: PaymentId,
  ): ResultAsync<boolean, InvalidPaymentIdError>;

  /**
   * Creates a PaymentId by combining
   * @param paymentType
   */
  createPaymentId(
    paymentType: EPaymentType,
  ): ResultAsync<PaymentId, InvalidParametersError>;

  sortTransfers(
    _paymentId: PaymentId,
    transfers: IFullTransferState[],
  ): ResultAsync<
    SortedTransfers,
    InvalidPaymentError | VectorError | LogicalError
  >;

  /**
   *
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  transfersToPayments(
    transfers: IFullTransferState[],
  ): ResultAsync<
    Payment[],
    VectorError | LogicalError | InvalidPaymentError | InvalidParametersError
  >;

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
   * @param id
   * @param to
   * @param from
   * @param state
   * @param sortedTransfers
   * @param metadata
   */
  transfersToPullPayment(
    id: PaymentId,
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
    id: PaymentId,
    state: EPaymentState,
    sortedTransfers: SortedTransfers,
  ): ResultAsync<PushPayment, LogicalError>;

  /**
   * Given an unsorted list of transfers, it will give you the timestamp of the
   * earliest one.
   * @param transfers an unsorted list of transfers
   * @returns the unix timestamp of the earliest transfer
   */
  getEarliestDateFromTransfers(transfers: IFullTransferState[]): UnixTimestamp;

  /**
   * Returns the calculated payment state, based on all the extant transfers.
   * @param sortedTransfers
   */
  getPaymentState(
    sortedTransfers: SortedTransfers,
  ): ResultAsync<EPaymentState, BlockchainUnavailableError>;
}
