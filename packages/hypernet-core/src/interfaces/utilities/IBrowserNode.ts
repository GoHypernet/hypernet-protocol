import {
  BigNumberString,
  EthereumAddress,
  IBasicChannelResponse,
  IBasicTransferResponse,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawQuote,
  IWithdrawResponse,
  PublicIdentifier,
  Signature,
  TransferId,
  VectorError,
  MessageResolver,
  InsuranceResolver,
  ParameterizedResolver,
  UnixTimestamp,
  ChainId,
  UtilityMessageSignature,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBrowserNode {
  onConditionalTransferResolved(
    callback: (
      payload: IConditionalTransferResolvedPayload,
    ) => void | Promise<void>,
    filter?: (payload: IConditionalTransferResolvedPayload) => boolean,
  ): Promise<void>;

  onConditionalTransferCreated(
    callback: (
      payload: IConditionalTransferCreatedPayload,
    ) => void | Promise<void>,
    filter?: (payload: IConditionalTransferCreatedPayload) => boolean,
  ): Promise<void>;

  readonly publicIdentifier: PublicIdentifier;

  /**
   *
   * @param assetId
   * @param channelAddress
   * @returns channelAddress
   */
  reconcileDeposit(
    assetId: EthereumAddress,
    channelAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, VectorError>;

  withdraw(
    channelAddress: EthereumAddress,
    amount: BigNumberString,
    assetId: EthereumAddress,
    recipient: EthereumAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError>;

  getTransfer(
    transferId: TransferId,
  ): ResultAsync<IFullTransferState<unknown, unknown>, VectorError>;

  getActiveTransfers(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError>;

  getTransfers(
    startDate: UnixTimestamp,
    endDate: UnixTimestamp,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError>;

  init(
    signature: Signature,
    account: EthereumAddress,
  ): ResultAsync<void, VectorError>;

  getRegisteredTransfers(
    chainId: ChainId,
  ): ResultAsync<IRegisteredTransfer[], VectorError>;

  signUtilityMessage(
    message: string,
  ): ResultAsync<UtilityMessageSignature, VectorError>;

  resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: TransferId,
    transferResolver:
      | MessageResolver
      | ParameterizedResolver
      | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  conditionalTransfer(
    channelAddress: EthereumAddress,
    amount: BigNumberString,
    assetId: EthereumAddress,
    type: string,
    details: unknown,
    recipient: PublicIdentifier | undefined,
    recipientChainId: number | undefined,
    recipientAssetId: EthereumAddress | undefined,
    timeout: string | undefined,
    meta: unknown | null | undefined,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  getStateChannels(): ResultAsync<EthereumAddress[], VectorError>;

  getStateChannel(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullChannelState | undefined, VectorError>;

  getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<IFullChannelState | undefined, VectorError>;

  setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: ChainId,
    timeout: string,
    meta?: unknown,
  ): ResultAsync<IBasicChannelResponse, VectorError>;

  restoreState(
    counterpartyIdentifier: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<void, VectorError>;
}
