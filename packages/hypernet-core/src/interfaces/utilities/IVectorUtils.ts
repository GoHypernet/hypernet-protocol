import { BigNumber, IHypernetOfferDetails, ResultAsync } from "@interfaces/objects";
import {
  CoreUninitializedError,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
} from "@interfaces/objects/errors";
import { EPaymentType, ETransferState } from "@interfaces/types";
import { IBasicTransferResponse, IFullTransferState } from "./IBrowserNode";

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
  resolveMessageTransfer(transferId: string): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  resolvePaymentTransfer(
    transferId: string,
    paymentId: string,
    amount: string,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   * @param transferId
   */
  resolveInsuranceTransfer(transferId: string): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   */
  createMessageTransfer(
    toAddress: string,
    message: IHypernetOfferDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError>;

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
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

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
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

  getTimestampFromTransfer(transfer: IFullTransferState): number;
  getTransferStateFromTransfer(transfer: IFullTransferState): ETransferState;
}
