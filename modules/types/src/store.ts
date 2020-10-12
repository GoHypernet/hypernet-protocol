import { providers } from "ethers";

import { WithdrawCommitmentJson } from "./transferDefinitions/withdraw";
import { FullChannelState, ChannelCommitmentData, FullTransferState } from "./channel";
import { Address } from "./basic";

export interface IVectorStore {
  // Store management methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSchemaVersion(): Promise<number | undefined>;
  updateSchemaVersion(version?: number): Promise<void>;
  clear(): Promise<void>;

  // Getters
  getChannelStates(): Promise<FullChannelState[]>;
  getChannelState(channelAddress: string): Promise<FullChannelState | undefined>;
  getChannelStateByParticipants(
    participantA: string,
    participantB: string,
    chainId: number,
  ): Promise<FullChannelState | undefined>;
  getChannelCommitment(channelAddress: string): Promise<ChannelCommitmentData | undefined>;
  // Should return all initial transfer state data needed to
  // create the merkle root
  getActiveTransfers(channelAddress: string): Promise<FullTransferState[]>;
  getTransferState(transferId: string): Promise<FullTransferState | undefined>;

  // Setters
  saveChannelState(
    channelState: FullChannelState,
    commitment: ChannelCommitmentData,
    transfer?: FullTransferState,
  ): Promise<void>;
}

export const StoredTransactionStatus = {
  submitted: "submitted",
  mined: "mined",
  failed: "failed",
} as const;
export type StoredTransactionStatus = keyof typeof StoredTransactionStatus;

export const TransactionReason = {
  allowance: "allowance",
  approveTokens: "approveTokens",
  depositA: "depositA",
  depositB: "depositB",
  deployWithDepositA: "deployWithDepositA",
  transferTokens: "transferTokens",
  withdraw: "withdraw",
} as const;
export type TransactionReason = keyof typeof TransactionReason;

export type StoredTransaction = {
  //// Helper fields
  channelAddress: string;
  status: StoredTransactionStatus;
  reason: TransactionReason;
  error?: string;

  //// Provider fields
  // Minimum fields (should always be defined)
  to: Address;
  from: Address;
  data: string;
  value: string;
  chainId: number;

  // TransactionRequest fields (defined when tx populated)
  nonce: number;
  gasLimit: string;
  gasPrice: string;

  // TransactionResponse fields (defined when submitted)
  transactionHash: string; // may be edited on mining
  timestamp?: number;
  raw?: string;
  blockHash?: string; // may be edited on mining
  blockNumber?: number; // may be edited on mining

  // TransactionReceipt fields (defined when mined)
  logs?: string;
  contractAddress?: string;
  transactionIndex?: number;
  root?: string;
  gasUsed?: string;
  logsBloom?: string;
  cumulativeGasUsed?: string;
  byzantium?: boolean;
};

export interface IChainServiceStore {
  // Store management methods
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  clear(): Promise<void>;

  // Getters
  getTransactionByHash(transactionHash: string): Promise<StoredTransaction | undefined>;

  // Setters
  saveTransactionResponse(
    channelAddress: string,
    reason: TransactionReason,
    transaction: providers.TransactionResponse,
  ): Promise<void>;
  saveTransactionReceipt(channelAddress: string, transaction: providers.TransactionReceipt): Promise<void>;
  saveTransactionFailure(channelAddress: string, transactionHash: string, error: string): Promise<void>;
}

export interface IEngineStore extends IVectorStore, IChainServiceStore {
  // Getters
  getWithdrawalCommitment(transferId: string): Promise<WithdrawCommitmentJson | undefined>;

  // NOTE: The engine does *not* care about the routingId (it is stored
  // in the meta of transfer objects), only the router module does.
  // However, because the engine fills in basic routing metas using sane
  // defaults, it should also be responsible for providing an easy-access
  // method for higher level modules
  getTransferByRoutingId(channelAddress: string, routingId: string): Promise<FullTransferState | undefined>;

  getTransfersByRoutingId(routingId: string): Promise<FullTransferState[]>;

  // Setters
  saveWithdrawalCommitment(transferId: string, withdrawCommitment: WithdrawCommitmentJson): Promise<void>;
}
