import { NodeResponses } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, ResultAsync } from "@interfaces/objects";
import {
  CoreUninitializedError,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
} from "@interfaces/objects/errors";
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
  resolveMessageTransfer(transferId: string): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError>;

  resolvePaymentTransfer(
    transferId: string,
    paymentId: string,
    amount: string,
  ): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError>;

  /**
   *
   * @param transferId
   */
  resolveInsuranceTransfer(transferId: string): ResultAsync<NodeResponses.ResolveTransfer, TransferResolutionError>;

  /**
   *
   */
  createMessageTransfer(
    toAddress: string,
    message: IHypernetTransferMetadata,
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError>;

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
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError | InvalidParametersError>;

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
  ): ResultAsync<NodeResponses.ConditionalTransfer, TransferCreationError | InvalidParametersError>;
}
