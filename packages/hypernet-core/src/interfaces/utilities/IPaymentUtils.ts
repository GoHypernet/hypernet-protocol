import {
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
  SortedTransfers,
} from "@interfaces/objects";
import { FullTransferState, NodeError } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { BrowserNode } from "@connext/vector-browser-node";
import { ResultAsync } from "neverthrow";
import { InvalidParametersError, InvalidPaymentError, LogicalError } from "@interfaces/objects/errors";

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
    transfers: FullTransferState[],
    browserNode: BrowserNode,
  ): ResultAsync<SortedTransfers, InvalidPaymentError | NodeError | Error>;

  /**
   *
   * @param transfers
   * @param config
   * @param context
   * @param browserNode
   */
  transfersToPayments(
    transfers: FullTransferState[],
    config: HypernetConfig,
    context: InitializedHypernetContext,
    browserNode: BrowserNode,
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
    transfers: FullTransferState[],
    config: HypernetConfig,
    browserNode: BrowserNode,
  ): ResultAsync<Payment, InvalidPaymentError | InvalidParametersError>;

  /**
   *
   * @param transfer
   */
  getTransferType(
    transfer: FullTransferState,
    browserNode: BrowserNode,
  ): ResultAsync<ETransferType, LogicalError | NodeError>;

  getTransferTypeWithTransfer(
    transfer: FullTransferState,
    browserNode: BrowserNode,
  ): ResultAsync<{ transferType: ETransferType; transfer: FullTransferState }, NodeError | Error>;

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
