import {
  BigNumberString,
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
  EthereumAccountAddress,
  EthereumContractAddress,
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
    assetId: EthereumContractAddress,
    channelAddress: EthereumContractAddress,
  ): ResultAsync<EthereumContractAddress, VectorError>;

  withdraw(
    channelAddress: EthereumContractAddress,
    amount: BigNumberString,
    assetId: EthereumContractAddress,
    recipient: EthereumAccountAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError>;

  getTransfer(
    transferId: TransferId,
  ): ResultAsync<IFullTransferState<unknown, unknown>, VectorError>;

  getActiveTransfers(
    channelAddress: EthereumContractAddress,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError>;

  getTransfers(
    startDate: UnixTimestamp,
    endDate: UnixTimestamp,
  ): ResultAsync<IFullTransferState<unknown, unknown>[], VectorError>;

  init(
    signature: Signature,
    account: EthereumAccountAddress,
  ): ResultAsync<void, VectorError>;

  getRegisteredTransfers(
    chainId: ChainId,
  ): ResultAsync<IRegisteredTransfer[], VectorError>;

  signUtilityMessage(
    message: string,
  ): ResultAsync<UtilityMessageSignature, VectorError>;

  resolveTransfer(
    channelAddress: EthereumContractAddress,
    transferId: TransferId,
    transferResolver:
      | MessageResolver
      | ParameterizedResolver
      | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  conditionalTransfer(
    channelAddress: EthereumContractAddress,
    amount: BigNumberString,
    assetId: EthereumContractAddress,
    type: string,
    details: unknown,
    recipient: PublicIdentifier | undefined,
    recipientChainId: number | undefined,
    recipientAssetId: EthereumContractAddress | undefined,
    timeout: string | undefined,
    meta: unknown | null | undefined,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  getStateChannels(): ResultAsync<EthereumContractAddress[], VectorError>;

  getStateChannel(
    channelAddress: EthereumContractAddress,
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
