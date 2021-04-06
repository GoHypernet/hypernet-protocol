import {
  IHypernetOfferDetails,
  PublicKey,
  IHypernetPullPaymentDetails,
  IBasicTransferResponse,
  IFullTransferState,
  EthereumAddress,
  PublicIdentifier,
  PaymentId,
} from "@hypernetlabs/objects";
import {
  CoreUninitializedError,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
  VectorError,
} from "@hypernetlabs/objects";
import { EPaymentType, ETransferState } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 *
 */
export interface IVectorUtils {
  /**
   *
   */
  getRouterChannelAddress(): ResultAsync<EthereumAddress, RouterChannelUnknownError | CoreUninitializedError | VectorError>;

  /**
   *
   * @param transferId
   */
  resolveMessageTransfer(transferId: string): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  resolvePaymentTransfer(
    transferId: string,
    paymentId: PaymentId,
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
    paymentId: PaymentId,
    mediatorSignature?: string,
    amount?: BigNumber,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   */
  createOfferTransfer(
    toAddress: PublicIdentifier,
    message: IHypernetOfferDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError>;

  createPullNotificationTransfer(
    toAddress: PublicIdentifier,
    message: IHypernetPullPaymentDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

  /**
   *
   * @param amount
   * @param assetAddress
   */
  createPaymentTransfer(
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumber,
    assetAddress: EthereumAddress,
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
    toAddress: PublicIdentifier,
    mediatorPublicKey: PublicKey,
    amount: BigNumber,
    expiration: number,
    UUID: string,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError | InvalidParametersError>;

  getTimestampFromTransfer(transfer: IFullTransferState): number;
  getTransferStateFromTransfer(transfer: IFullTransferState): ETransferState;
}
