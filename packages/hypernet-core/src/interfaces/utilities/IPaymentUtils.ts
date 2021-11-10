import {
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
  VectorError,
  InvalidPaymentIdError,
  BlockchainUnavailableError,
  InsuranceState,
  IHypernetOfferDetails,
  ParameterizedState,
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
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError>;

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
    (PushPayment | PullPayment)[],
    VectorError | InvalidPaymentError | InvalidParametersError
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
  ): ResultAsync<
    PushPayment | PullPayment,
    InvalidPaymentError | InvalidParametersError
  >;

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
  ): ResultAsync<PullPayment, never>;

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
  ): ResultAsync<PushPayment, never>;

  /**
   * Given an unsorted list of transfers, it will give you the timestamp of the
   * earliest one.
   * @param transfers an unsorted list of transfers
   * @returns the unix timestamp of the earliest transfer
   */
  getEarliestDateFromTransfers(transfers: IFullTransferState[]): UnixTimestamp;

  /**
   * Returns the first transfer from a list of transfers, based on the timestamp.
   * This will throw an error if the transfers list is empty.
   * @param transfers a list of random transfers
   */
  getFirstTransfer(transfers: IFullTransferState[]): IFullTransferState;

  /**
   * Returns the calculated payment state, based on all the extant transfers.
   * @param sortedTransfers
   */
  getPaymentState(
    sortedTransfers: SortedTransfers,
  ): ResultAsync<EPaymentState, BlockchainUnavailableError>;

  /**
   * This returns true if the provided insurance transfer matches the terms of the offer details
   * @param transfer an insurance transfer
   * @param offerDetails the details of the offer you are validating
   */
  validateInsuranceTransfer(
    transfer: IFullTransferState<InsuranceState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean;

  /**
   * This returns true if the provided payment transfer matches the terms of the offer details
   * @param transfer a parameterized transfer
   * @param offerDetails the details of the offer you are validating
   */
  validatePaymentTransfer(
    transfer: IFullTransferState<ParameterizedState>,
    offerDetails: IHypernetOfferDetails,
  ): boolean;
}

export const IPaymentUtilsType = Symbol.for("IPaymentUtils");
