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
  ): ResultAsync<IFullTransferState, VectorError>;

  getActiveTransfers(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullTransferState[], VectorError>;

  getTransfers(
    startDate: UnixTimestamp,
    endDate: UnixTimestamp,
  ): ResultAsync<IFullTransferState[], VectorError>;

  init(
    signature: Signature,
    account: EthereumAddress,
  ): ResultAsync<void, VectorError>;

  getRegisteredTransfers(
    chainId: number,
  ): ResultAsync<IRegisteredTransfer[], VectorError>;

  signUtilityMessage(message: string): ResultAsync<Signature, VectorError>;

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
    details: any,
    recipient: PublicIdentifier | undefined,
    recipientChainId: number | undefined,
    recipientAssetId: EthereumAddress | undefined,
    timeout: string | undefined,
    meta: any | null | undefined,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  getStateChannels(): ResultAsync<EthereumAddress[], VectorError>;

  getStateChannel(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullChannelState | undefined, VectorError>;

  getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: number,
  ): ResultAsync<IFullChannelState | undefined, VectorError>;

  setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
    timeout: string,
    meta?: any,
  ): ResultAsync<IBasicChannelResponse, VectorError>;

  restoreState(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
  ): ResultAsync<void, VectorError>;
}
