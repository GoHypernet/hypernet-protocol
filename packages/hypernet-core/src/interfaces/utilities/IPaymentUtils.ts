import {
  HypernetConfig,
  IHypernetTransferMetadata,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
} from "@interfaces/objects";
import { FullTransferState } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { BrowserNode } from "@connext/vector-browser-node";
import { SortedTransfers } from "@implementations/utilities";

export interface IPaymentUtils {
  /**
   *
   * @param paymentId
   */
  isHypernetDomain(paymentId: string): Promise<boolean>;

  /**
   *
   * @param paymentType
   */
  createPaymentId(paymentType: EPaymentType): Promise<string>;

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
  ): Promise<Payment[]>;

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
  ): Promise<Payment>;

  /**
   *
   * @param paymentId
   * @param transfers
   * @param browserNode
   */
  sortTransfers(paymentId: string, transfers: FullTransferState[], browserNode: BrowserNode): Promise<ISortedTransfers>;

  /**
   *
   * @param transfer
   */
  getTransferType(transfer: FullTransferState): ETransferType;

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
  ): PullPayment;

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
  ): PushPayment;
}

export interface ISortedTransfers {
  offerTransfer: FullTransferState;
  insuranceTransfer: FullTransferState | null;
  parameterizedTransfer: FullTransferState | null;
  pullRecordTransfers: FullTransferState[];
  metadata: IHypernetTransferMetadata;
}
