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
  TransferCreationError,
  TransferResolutionError,
  VectorError,
  EPaymentType,
  ETransferState,
  BigNumberString,
  UnixTimestamp,
  ETransferType,
  BlockchainUnavailableError,
  ChainId,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 * VectorUtils are for working with low-level transfers and directly with vector concepts.
 */
export interface IVectorUtils {
  /**
   * Returns the address of the channel with the router and chain, if it exists.
   * Otherwise, attempts to create a channel with the router & return the address.
   */
  getRouterChannelAddress(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<EthereumAddress, VectorError>;

  /**
   * Resolves a message transfer
   * @param transferId
   * @param message This can be anything you like, except the blank string "", which is reserved for canceling
   */
  resolveMessageTransfer(
    transferId: TransferId,
    message?: string,
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
    amount: BigNumberString,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   * Resolves a payment transfer for an amount
   * @param transferId
   * @param paymentId
   * @param amount
   */
  resolveParameterizedTransfer(
    transferId: TransferId,
    paymentId: PaymentId,
    amount: BigNumberString,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   * Cancels a Message transfer.
   * Canceled transfers are distinct from resolved ones; they always have null values.
   * @param transferId
   */
  cancelMessageTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   * Cancels an Insurance transfer.
   * Canceled transfers are distinct from resolved ones; they always have null values.
   * @param transferId
   */
  cancelInsuranceTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   * Cancels a Parameterized transfer.
   * Canceled transfers are distinct from resolved ones; they always have null values.
   * @param transferId
   */
  cancelParameterizedTransfer(
    transferId: TransferId,
  ): ResultAsync<IBasicTransferResponse, TransferResolutionError>;

  /**
   *
   */
  createOfferTransfer(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    toAddress: PublicIdentifier,
    message: IHypernetOfferDetails,
  ): ResultAsync<IBasicTransferResponse, TransferCreationError>;

  createPullNotificationTransfer(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    toAddress: PublicIdentifier,
    message: IHypernetPullPaymentDetails,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  >;

  /**
   * Creates an Insurance transfer. Insurance transfers can be resolved by the reciever for 0,
   * or resolved for more than 0 by a third party dispute mediator. The mediator will provide a
   * signature for the non-0 amount.
   * @param toAddress
   * @param mediatorAddress
   * @param amount
   * @param expiration
   * @param UUID
   */
  createInsuranceTransfer(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    toAddress: PublicIdentifier,
    mediatorAddress: EthereumAddress,
    amount: BigNumberString,
    expiration: UnixTimestamp,
    paymentId: PaymentId,
  ): ResultAsync<
    IBasicTransferResponse,
    TransferCreationError | InvalidParametersError
  >;

  /**
   * Creates a Parameterized transfer. This is a form of payment transfer that "matures" at a rate
   * defined by deltaTime and deltaAmount
   * @param type
   * @param toAddress the public identifier of the intended recipient of this transfer
   * @param amount the amount of tokens to commit to this transfer
   * @param assetAddress the address of the ERC20-token to transfer; zero-address for ETH
   * @param paymentId length-64 hexadecimal string; this becomes the UUID component of the ParameterizedState
   * @param start the start time of this transfer (UNIX timestamp)
   * @param expiration the expiration time of this transfer (UNIX timestamp)
   * @param deltaTime
   * @param deltaAmount
   */
  createParameterizedTransfer(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
    type: EPaymentType,
    toAddress: PublicIdentifier,
    amount: BigNumberString,
    assetAddress: EthereumAddress,
    paymentId: PaymentId,
    start: UnixTimestamp,
    expiration: UnixTimestamp,
    deltaTime?: number,
    deltaAmount?: BigNumberString,
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

  getAllActiveTransfers(): ResultAsync<IFullTransferState[], VectorError>;
}

export const IVectorUtilsType = Symbol.for("IVectorUtils");
