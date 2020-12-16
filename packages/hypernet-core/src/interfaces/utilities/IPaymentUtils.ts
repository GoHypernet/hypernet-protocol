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
import { FullTransferState } from "@connext/vector-types";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";
import { BrowserNode } from "@connext/vector-browser-node";
import { IBrowserNodeProvider } from "./IBrowserNodeProvider";

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

  sortTransfers(
    _paymentId: string,
    transfers: FullTransferState[],
    browserNode: BrowserNode,
  ): Promise<SortedTransfers>

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
   * @param transfer
   */
  getTransferType(transfer: FullTransferState, browserNode: BrowserNode): Promise<ETransferType>;

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
