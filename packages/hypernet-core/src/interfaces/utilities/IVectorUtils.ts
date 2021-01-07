import { NodeResponses } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";
import { EPaymentType } from "@interfaces/types";

/**
 *
 */
export interface IVectorUtils {
  /**
   *
   */
  getRouterChannelAddress(): ResultAsync<string, RouterChannelUnknownError | CoreUninitializedError>;

  /**
   *
   * @param transferId
   */
  resolveMessageTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer>;

  resolvePaymentTransfer(transferId: string, paymentId: string, amount: string): Promise<NodeResponses.ResolveTransfer>;

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
