import {
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
} from "@hypernetlabs/objects";
import { VectorError } from "@hypernetlabs/objects";
import { MessageResolver, InsuranceResolver, ParameterizedResolver } from "@hypernetlabs/objects/types/typechain";
import { ResultAsync } from "neverthrow";

export interface IBrowserNode {
  onConditionalTransferResolved(
    callback: (payload: IConditionalTransferResolvedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferResolvedPayload) => boolean,
  ): Promise<void>;

  onConditionalTransferCreated(
    callback: (payload: IConditionalTransferCreatedPayload) => void | Promise<void>,
    filter?: (payload: IConditionalTransferCreatedPayload) => boolean,
  ): Promise<void>;

  readonly publicIdentifier: PublicIdentifier;

  /**
   *
   * @param assetId
   * @param channelAddress
   * @returns channelAddress
   */
  reconcileDeposit(assetId: EthereumAddress, channelAddress: EthereumAddress): ResultAsync<string, VectorError>;

  withdraw(
    channelAddress: EthereumAddress,
    amount: string,
    assetId: string,
    recipient: EthereumAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError>;

  getTransfer(transferId: string): ResultAsync<IFullTransferState, VectorError>;

  getActiveTransfers(channelAddress: string): ResultAsync<IFullTransferState[], VectorError>;

  getTransfers(startDate: number, endDate: number): ResultAsync<IFullTransferState[], VectorError>;

  init(signature: string, account: string): ResultAsync<void, VectorError>;

  getRegisteredTransfers(chainId: number): ResultAsync<IRegisteredTransfer[], VectorError>;

  signUtilityMessage(message: string): ResultAsync<string, VectorError>;

  resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: string,
    transferResolver: MessageResolver | ParameterizedResolver | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError>;

  conditionalTransfer(
    channelAddress: EthereumAddress,
    amount: string,
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

  getStateChannel(channelAddress: EthereumAddress): ResultAsync<IFullChannelState | undefined, VectorError>;

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

  restoreState(counterpartyIdentifier: PublicIdentifier, chainId: number): ResultAsync<void, VectorError>;
}
