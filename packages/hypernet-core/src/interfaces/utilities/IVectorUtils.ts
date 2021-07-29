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
  ETransferType,
  BlockchainUnavailableError,
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

  /**
   * Returns the state of the transfer. Transfers can be active, resolved, or canceled.
   * A resolved transfer is canceled if it was resolved via the EncodedCancel
   * transferResolution; if this is not the case the transfer is just resolved.
   *
   * @param transfer
   */
  getTransferStateFromTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<ETransferState, BlockchainUnavailableError>;

  /**
   *
   * @param transfer
   */
  getTransferType(
    transfer: IFullTransferState,
  ): ResultAsync<ETransferType, VectorError>;

  getTransferTypeWithTransfer(
    transfer: IFullTransferState,
  ): ResultAsync<
    { transferType: ETransferType; transfer: IFullTransferState },
    VectorError
  >;
}

export const IVectorUtilsType = Symbol.for("IVectorUtils");
