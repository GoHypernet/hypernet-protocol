import { Address, Balance, FullTransferState, TransferName } from "@connext/vector-types";
import { EthereumAddress, IHypernetOfferDetails, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import { VectorError } from "@interfaces/objects/errors";
import { ParameterizedResolver } from "@interfaces/types/typechain";

export interface IConditionalTransferResolvedPayload {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: FullTransferState;
  channelBalance: Balance;
  conditionType: TransferName | Address;
  activeTransferIds?: string[];
}

export interface IConditionalTransferCreatedPayload {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: FullTransferState;
  channelBalance: Balance;
  conditionType: TransferName | Address;
  activeTransferIds?: string[];
}

export interface IWithdrawResponse {
  channelAddress: EthereumAddress;
  transferId: string;
  transactionHash?: string;
}

export interface IBalance {
  to: string[];
  amount: string[];
}

export interface IChannelUpdate {
  channelAddress: EthereumAddress;
  fromIdentifier: PublicIdentifier;
  toIdentifier: PublicIdentifier;
  type: string;
  nonce: number;
  balance: IBalance;
  assetId: EthereumAddress;
  details: any;
  aliceSignature?: string | null;
  bobSignature?: string | null;
}

export interface INetworkContext {
  channelFactoryAddress: EthereumAddress;
  transferRegistryAddress: EthereumAddress;
  chainId: number;
  providerUrl: string;
}

export interface IFullTransferState<TTransferState = any> {
  balance: IBalance;
  assetId: EthereumAddress;
  channelAddress: EthereumAddress;
  inDispute: boolean;
  transferId: string;
  transferDefinition: EthereumAddress;
  transferTimeout: string;
  initialStateHash: string;
  initiator: EthereumAddress; // either alice or bob
  responder: EthereumAddress; // either alice or bob
  channelFactoryAddress: EthereumAddress; // networkContext?
  chainId: number;
  transferEncodings: string[]; // Initial state encoding, resolver encoding
  transferState: TTransferState;
  transferResolver?: any; // undefined iff not resolved
  meta?: any;
  channelNonce: number;
  initiatorIdentifier: PublicIdentifier;
  responderIdentifier: PublicIdentifier;
}

export interface IFullChannelState {
  assetIds: EthereumAddress[];
  balances: IBalance[];
  channelAddress: EthereumAddress;
  alice: EthereumAddress;
  bob: EthereumAddress;
  merkleRoot: string;
  nonce: number;
  processedDepositsA: string[];
  processedDepositsB: string[];
  timeout: string;
  aliceIdentifier: PublicIdentifier;
  bobIdentifier: PublicIdentifier;
  latestUpdate: IChannelUpdate;
  networkContext: INetworkContext;
  defundNonces: string[];
  inDispute: boolean;
}

export interface IRegisteredTransfer {
  name: string;
  stateEncoding: string;
  resolverEncoding: string;
  definition: EthereumAddress;
  encodedCancel: string;
}

export interface IBasicTransferResponse {
  channelAddress: EthereumAddress;
  transferId: string;
  routingId?: string;
}

export interface IBasicChannelResponse {
  channelAddress: EthereumAddress;
}

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
    assetId: EthereumAddress,
    recipient: EthereumAddress,
    fee: string,
    callTo?: string,
    callData?: string,
    meta?: any,
  ): ResultAsync<IWithdrawResponse, VectorError>;

  getTransfer(transferId: string): ResultAsync<IFullTransferState, VectorError>;

  getActiveTransfers(channelAddress: string): ResultAsync<IFullTransferState[], VectorError>;

  getTransfers(startDate: number, endDate: number): ResultAsync<IFullTransferState[], VectorError>;

  init(): ResultAsync<void, VectorError>;

  getRegisteredTransfers(chainId: number): ResultAsync<IRegisteredTransfer[], VectorError>;

  signUtilityMessage(message: string): ResultAsync<string, VectorError>;

  resolveTransfer(
    channelAddress: EthereumAddress,
    transferId: string,
    transferResolver: ParameterizedResolver,
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

  setup(
    counterpartyIdentifier: PublicIdentifier,
    chainId: number,
    timeout: string,
    meta?: any,
  ): ResultAsync<IBasicChannelResponse, VectorError>;
}
