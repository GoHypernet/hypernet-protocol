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
  channelAddress: EthereumAddress;
  transferId: string;
  transactionHash?: string;
}

export interface IWithdrawQuote {
  channelAddress: EthereumAddress;
  amount: string;
  assetId: EthereumAddress;
  fee: string;
  expiry: string;
  signature?: string;
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
