import { FullTransferState, NodeParams, NodeResponses } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, PublicIdentifier } from "@interfaces/objects";
import { EPaymentType } from "@interfaces/types";

/**
 *
 */
export interface IVectorUtils {
  /**
   *
   */
  getRouterChannelAddress(): Promise<string>;

  /**
   *
   * @param transferId
   */
  resolveMessageTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer>;

  /**
   *
   * @param transferId
   */
  resolvePaymentTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer>;

  /**
   *
   * @param transferId
   */
  resolveInsuranceTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer>;

  /**
   *
   */
  createMessageTransfer(
    toAddress: string,
    message: IHypernetTransferMetadata,
  ): Promise<NodeResponses.ConditionalTransfer>;

  /**
   *
   * @param amount
   * @param assetAddress
   */
  createPaymentTransfer(
    type: EPaymentType,
    toAddress: string,
    amount: BigNumber,
    assetAddress: string,
    UUID: string,
    start: string,
    expiration: string,
  ): Promise<NodeResponses.ConditionalTransfer>;

  /**
   *
   * @param toAddress
   * @param amount
   */
  createInsuranceTransfer(
    toAddress: string,
    mediatorAddress: string,
    amount: BigNumber,
    expiration: string,
    UUID: string,
  ): Promise<NodeResponses.ConditionalTransfer>;
}
