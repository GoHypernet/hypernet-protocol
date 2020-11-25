import { FullTransferState, NodeParams, NodeResponses } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, PublicIdentifier } from "@interfaces/objects";

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
   */
  createNullTransfer(
    toAddress: string, 
    message: IHypernetTransferMetadata): Promise<NodeResponses.ConditionalTransfer>

  /**
   * 
   * @param amount 
   * @param assetAddress 
   */
  createPaymentTransfer(
    toAddress: string,
    amount: BigNumber,
    assetAddress: string
  ): Promise<NodeResponses.ConditionalTransfer> 

  /**
   * 
   * @param toAddress
   * @param amount
   */
  createInsuranceTransfer(
    toAddress: string,
    amount: BigNumber
  ): Promise<NodeResponses.ConditionalTransfer>
}
