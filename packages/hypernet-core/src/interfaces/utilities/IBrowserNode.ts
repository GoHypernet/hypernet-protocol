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
  TransferId,
} from "@hypernetlabs/objects";
import { VectorError, InvalidParametersError } from "@hypernetlabs/objects";
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
  reconcileDeposit(
    assetId: EthereumAddress,
    channelAddress: EthereumAddress,
  ): ResultAsync<EthereumAddress, VectorError | InvalidParametersError>;

  withdraw(
    channelAddress: EthereumAddress,
    amount: string,
    assetId: EthereumAddress,
    recipient: EthereumAddress,
    quote?: IWithdrawQuote,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError | InvalidParametersError>;

  getTransfer(transferId: TransferId): ResultAsync<IFullTransferState, VectorError | InvalidParametersError>;

  getActiveTransfers(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullTransferState[], VectorError | InvalidParametersError>;

  getTransfers(
    startDate: number,
    endDate: number,
  ): ResultAsync<IFullTransferState[], VectorError | InvalidParametersError>;

  init(signature: string, account: EthereumAddress): ResultAsync<void, VectorError | InvalidParametersError>;

  getRegisteredTransfers(chainId: number): ResultAsync<IRegisteredTransfer[], VectorError | InvalidParametersError>;

  signUtilityMessage(message: string): ResultAsync<string, VectorError | InvalidParametersError>;

  resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: TransferId,
    transferResolver: MessageResolver | ParameterizedResolver | InsuranceResolver,
  ): ResultAsync<IBasicTransferResponse, VectorError | InvalidParametersError>;

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
  ): ResultAsync<IBasicTransferResponse, VectorError | InvalidParametersError>;

  getStateChannels(): ResultAsync<EthereumAddress[], VectorError>;

  getStateChannel(
    channelAddress: EthereumAddress,
  ): ResultAsync<IFullChannelState | undefined, VectorError | InvalidParametersError>;

  getStateChannelByParticipants(
    counterparty: PublicIdentifier,
    chainId: number,
  ): ResultAsync<IFullChannelState | undefined, VectorError | InvalidParametersError>;

  setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
    timeout: string,
    meta?: any,
  ): ResultAsync<IBasicChannelResponse, VectorError | InvalidParametersError>;

  restoreState(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
  ): ResultAsync<void, VectorError | InvalidParametersError>;
}
