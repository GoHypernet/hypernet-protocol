import {
  IHypernetOfferDetails,
  IHypernetPullPaymentDetails,
  IBasicTransferResponse,
  IFullTransferState,
  EthereumAddress,
  PublicIdentifier,
  PaymentId,
  TransferId,
  Signature,
  InvalidParametersError,
  RouterChannelUnknownError,
  TransferCreationError,
  TransferResolutionError,
  VectorError,
  EPaymentType,
  ETransferState,
  BigNumberString,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

/**
 *
 */
export interface IVectorUtils {
  /**
   *
   */
  getRouterChannelAddress(): ResultAsync<
    EthereumAddress,
    RouterChannelUnknownError | VectorError
  >;

  /**
   *
   * @param transferId
   */
  resolveMessageTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  resolvePaymentTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    amount: string,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   * @param transferId
   * @param paymentId
   * @param gatewaySignature
   * @param amount
   */
  resolveInsuranceTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    gatewaySignature: Signature | null,
    amount: BigNumber,
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
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  >;

  /**
   *
   * @param amount
   * @param assetAddress
   */
  createPaymentTransfer(
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumberString,
    assetAddress: EthereumAddress,
    UUID: string,
    start: UnixTimestamp,
    expiration: UnixTimestamp,
    deltaTime?: number,
    deltaAmount?: string,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  >;

  /**
   *
   * @param toAddress
   * @param amount
   */
  createInsuranceTransfer(
    toAddress: PublicIdentifier,
    mediatorAddress: EthereumAddress,
    amount: BigNumberString,
    expiration: UnixTimestamp,
    UUID: string,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  >;

  getTimestampFromTransfer(transfer: IFullTransferState): UnixTimestamp;
  getTransferStateFromTransfer(transfer: IFullTransferState): ETransferState;
}

export const IVectorUtilsType = Symbol.for("IVectorUtils");
