import { Payment, PublicIdentifier, PullPayment, PushPayment, SortedTransfers, ResultAsync } from "@interfaces/objects";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { InvalidParametersError, InvalidPaymentError, LogicalError, VectorError } from "@interfaces/objects/errors";
import { IFullTransferState } from "./IBrowserNode";

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
  ): ResultAsync<SortedTransfers, InvalidPaymentError | VectorError | Error>;

  /**
   *
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  transfersToPayments(transfers: IFullTransferState[]): ResultAsync<Payment[], InvalidPaymentError>;

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
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>;

  /**
   *
   * @param transfer
   */
  getTransferType(transfer: IFullTransferState): ResultAsync<ETransferType, LogicalError | VectorError>;

  getTransferTypeWithTransfer(
    transfer: IFullTransferState,
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
  ): ResultAsync<PushPayment, Error>;
}
