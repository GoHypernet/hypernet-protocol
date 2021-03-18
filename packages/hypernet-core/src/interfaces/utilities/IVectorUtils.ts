import {
  IHypernetOfferDetails,
  PublicKey,
  IHypernetPullPaymentDetails,
  IBasicTransferResponse,
  IFullTransferState,
} from "@hypernetlabs/objects";
import {
  CoreUninitializedError,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
} from "@hypernetlabs/objects/errors";
import { EPaymentType, ETransferState } from "@hypernetlabs/objects/types";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

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
   * @param paymentId
   * @param mediatorSignature
   * @param amount
   */
  resolveInsuranceTransfer(
    transferId: string,
    paymentId: string,
    mediatorSignature?: string,
    amount?: BigNumber,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   */
  createOfferTransfer(
    toAddress: string,
    message: IHypernetOfferDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError>;

  createPullNotificationTransfer(
    toAddress: string,
    message: IHypernetPullPaymentDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

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
    start: number,
    expiration: number,
    deltaTime?: number,
    deltaAmount?: string,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

  /**
   *
   * @param toAddress
   * @param amount
   */
  createInsuranceTransfer(
    toAddress: string,
    mediatorPublicKey: PublicKey,
    amount: BigNumber,
    expiration: number,
    UUID: string,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

  getTimestampFromTransfer(transfer: IFullTransferState): number;
  getTransferStateFromTransfer(transfer: IFullTransferState): ETransferState;
}
