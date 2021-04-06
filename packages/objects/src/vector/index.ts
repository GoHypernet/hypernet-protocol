import { EthereumAddress } from "@objects/EthereumAddress";
import { PublicIdentifier } from "@objects/PublicIdentifier";

export interface IConditionalTransferResolvedPayload {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: IFullTransferState;
  channelBalance: IBalance;
  conditionType: string;
  activeTransferIds?: string[];
}

export interface IConditionalTransferCreatedPayload {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: IFullTransferState;
  channelBalance: IBalance;
  conditionType: string;
  activeTransferIds?: string[];
}

export interface IWithdrawResponse {
  channelAddress: string; // EthereumAddress
  transferId: string;
  transactionHash?: string;
}

export interface IWithdrawQuote {
  channelAddress: string; // EthereumAddress
  amount: string;
  assetId: string; // EthereumAddress
  fee: string;
  expiry: string;
  signature?: string;
}

export interface IBalance {
  to: string[];
  amount: string[];
}

export interface IChannelUpdate {
  channelAddress: string; // EthereumAddress
  fromIdentifier: string; // PublicIdentifier
  toIdentifier: string; // PublicIdentifier
  type: string;
  nonce: number;
  balance: IBalance;
  assetId: string; // EthereumAddress
  details: any;
  aliceSignature?: string | null;
  bobSignature?: string | null;
}

export interface INetworkContext {
  channelFactoryAddress: string; // EthereumAddress
  transferRegistryAddress: string; // EthereumAddress
  chainId: number;
}

export interface IFullTransferState<TTransferState = any> {
  balance: IBalance;
  assetId: string; // EthereumAddress
  channelAddress: string; // EthereumAddress
  inDispute: boolean;
  transferId: string;
  transferDefinition: string; // EthereumAddress
  transferTimeout: string;
  initialStateHash: string;
  initiator: string; // EthereumAddress, either alice or bob
  responder: string; // EthereumAddress, either alice or bob
  channelFactoryAddress: string; // networkContext?
  chainId: number;
  transferEncodings: string[]; // Initial state encoding, resolver encoding
  transferState: TTransferState;
  transferResolver?: any; // undefined iff not resolved
  meta?: any;
  channelNonce: number;
  initiatorIdentifier: string; // PublicIdentifier
  responderIdentifier: string; // PublicIdentifier
}

export interface IFullChannelState {
  assetIds: string[]; // EthereumAddress[]
  balances: IBalance[];
  channelAddress: string; // EthereumAddress
  alice: string; // EthereumAddress;
  bob: string; // EthereumAddress;
  merkleRoot: string;
  nonce: number;
  processedDepositsA: string[];
  processedDepositsB: string[];
  timeout: string;
  aliceIdentifier: string; // PublicIdentifier;
  bobIdentifier: string; // PublicIdentifier;
  latestUpdate: IChannelUpdate;
  networkContext: INetworkContext;
  defundNonces: string[];
  inDispute: boolean;
}

export interface IRegisteredTransfer {
  name: string;
  stateEncoding: string;
  resolverEncoding: string;
  definition: string; // EthereumAddress;
  encodedCancel: string;
}

export interface IBasicTransferResponse {
  channelAddress: string; // EthereumAddress;
  transferId: string;
  routingId?: string;
}

export interface IBasicChannelResponse {
  channelAddress: string; // EthereumAddress;
}
