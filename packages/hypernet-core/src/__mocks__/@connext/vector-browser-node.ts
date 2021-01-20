import {
  ChainAddresses,
  ChainProviders,
  EngineEventMap,
  IChannelSigner,
  INodeService,
  NodeError,
  OptionalPublicIdentifier,
  Result,
} from "@connext/vector-types";
import { StaticProperties, TString, TDict, TUnion, TBoolean, TObject, TUndefined, TArray, TNumber, TLiteral, TAny, TOptional, TNull, TIntersect, StaticArray, TInteger, StaticDict } from "@sinclair/typebox";
import { ok } from "neverthrow";
import pino, { BaseLogger } from "pino";

export type BrowserNodeSignerConfig = {
  natsUrl?: string;
  authUrl?: string;
  messagingUrl?: string;
  logger?: BaseLogger;
  signer: IChannelSigner;
  chainProviders: ChainProviders;
  chainAddresses: ChainAddresses;
};

export class BrowserNode implements INodeService {
  publicIdentifier: string;
  signerAddress: string;

  constructor(params: {
    logger?: pino.BaseLogger;
    routerPublicIdentifier?: string;
    supportedChains?: number[];
    iframeSrc?: string;
    chainProviders: ChainProviders;
  }) {
    this.signerAddress = "";
    this.publicIdentifier = "";
  }

  async init(): Promise<void> {

  }
  getStatus(): Promise<Result<StaticProperties<{ publicIdentifier: TString; signerAddress: TString; providerSyncing: TDict<TUnion<[TBoolean, TObject<{ startingBlock: TString; currentBlock: TString; highestBlock: TString; }>, TString, TUndefined]>>; version: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getRouterConfig(params: OptionalPublicIdentifier<{} & {} & {} & { routerIdentifier: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ supportedChains: TArray<TNumber>; allowedSwaps: TArray<TObject<{ fromChainId: TNumber; toChainId: TNumber; fromAssetId: TString; toAssetId: TString; priceType: TUnion<[TLiteral<"hardcoded">]>; hardcodedRate: TString; }>>; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getStateChannelByParticipants(params: OptionalPublicIdentifier<StaticProperties<{ publicIdentifier: TString; counterparty: TString; chainId: TNumber; }>>): Promise<Result<StaticProperties<{ assetIds: TArray<TString>; balances: TArray<TObject<{ to: TArray<TString>; amount: TArray<TString>; }>>; channelAddress: TString; alice: TString; bob: TString; merkleRoot: TString; nonce: TNumber; processedDepositsA: TArray<TString>; processedDepositsB: TArray<TString>; timeout: TString; aliceIdentifier: TString; bobIdentifier: TString; latestUpdate: TObject<{ channelAddress: TString; fromIdentifier: TString; toIdentifier: TString; type: TUnion<[TLiteral<"setup" | "create" | "resolve" | "deposit">]>; nonce: TNumber; balance: TObject<{ to: TArray<TString>; amount: TArray<TString>; }>; assetId: TString; details: TDict<TAny>; aliceSignature: TOptional<TUnion<[TString, TNull]>>; bobSignature: TOptional<TUnion<[TString, TNull]>>; }>; networkContext: TIntersect<[TObject<{ channelFactoryAddress: TString; transferRegistryAddress: TString; }>, TObject<{ chainId: TNumber; providerUrl: TString; }>]>; defundNonces: TArray<TString>; inDispute: TBoolean; }> | undefined, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getStateChannels(params: OptionalPublicIdentifier<{} & {} & {} & {} & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticArray<TString>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getStateChannel(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ assetIds: TArray<TString>; balances: TArray<TObject<{ to: TArray<TString>; amount: TArray<TString>; }>>; channelAddress: TString; alice: TString; bob: TString; merkleRoot: TString; nonce: TNumber; processedDepositsA: TArray<TString>; processedDepositsB: TArray<TString>; timeout: TString; aliceIdentifier: TString; bobIdentifier: TString; latestUpdate: TObject<{ channelAddress: TString; fromIdentifier: TString; toIdentifier: TString; type: TUnion<[TLiteral<"setup" | "create" | "resolve" | "deposit">]>; nonce: TNumber; balance: TObject<{ to: TArray<TString>; amount: TArray<TString>; }>; assetId: TString; details: TDict<TAny>; aliceSignature: TOptional<TUnion<[TString, TNull]>>; bobSignature: TOptional<TUnion<[TString, TNull]>>; }>; networkContext: TIntersect<[TObject<{ channelFactoryAddress: TString; transferRegistryAddress: TString; }>, TObject<{ chainId: TNumber; providerUrl: TString; }>]>; defundNonces: TArray<TString>; inDispute: TBoolean; }> | undefined, NodeError>> {
    return Result.ok("test-channel");
  }
  getTransferByRoutingId(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; routingId: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ balance: TObject<{ to: TArray<TString>; amount: TArray<TString>; }>; assetId: TString; channelAddress: TString; inDispute: TBoolean; transferId: TString; transferDefinition: TString; transferTimeout: TString; initialStateHash: TString; initiator: TString; responder: TString; channelFactoryAddress: TString; chainId: TNumber; transferEncodings: TArray<TString>; transferState: TDict<TAny>; transferResolver: TOptional<TAny>; meta: TOptional<TDict<TAny>>; channelNonce: TInteger; initiatorIdentifier: TString; responderIdentifier: TString; }> | undefined, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getTransfersByRoutingId(params: OptionalPublicIdentifier<{} & {} & {} & { routingId: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticArray<TObject<{ balance: TObject<{ to: TArray<TString>; amount: TArray<TString>; }>; assetId: TString; channelAddress: TString; inDispute: TBoolean; transferId: TString; transferDefinition: TString; transferTimeout: TString; initialStateHash: TString; initiator: TString; responder: TString; channelFactoryAddress: TString; chainId: TNumber; transferEncodings: TArray<TString>; transferState: TDict<TAny>; transferResolver: TOptional<TAny>; meta: TOptional<TDict<TAny>>; channelNonce: TInteger; initiatorIdentifier: TString; responderIdentifier: TString; }>>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getTransfer(params: OptionalPublicIdentifier<{} & {} & {} & { transferId: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<unknown, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getActiveTransfers(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticArray<TObject<{ balance: TObject<{ to: TArray<TString>; amount: TArray<TString>; }>; assetId: TString; channelAddress: TString; inDispute: TBoolean; transferId: TString; transferDefinition: TString; transferTimeout: TString; initialStateHash: TString; initiator: TString; responder: TString; channelFactoryAddress: TString; chainId: TNumber; transferEncodings: TArray<TString>; transferState: TDict<TAny>; transferResolver: TOptional<TAny>; meta: TOptional<TDict<TAny>>; channelNonce: TInteger; initiatorIdentifier: TString; responderIdentifier: TString; }>>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  getRegisteredTransfers(params: OptionalPublicIdentifier<{} & {} & {} & { chainId: number; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticArray<TObject<{ name: TString; stateEncoding: TString; resolverEncoding: TString; definition: TString; encodedCancel: TString; }>>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  createNode(params: StaticProperties<{ index: TInteger; mnemonic: TOptional<TString>; skipCheckIn: TOptional<TBoolean>; }>): Promise<Result<StaticProperties<{ publicIdentifier: TString; signerAddress: TString; index: TInteger; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  setup(params: OptionalPublicIdentifier<{} & {} & { meta?: StaticDict<TAny> | undefined; } & { timeout: string; chainId: number; counterpartyIdentifier: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  internalSetup(params: OptionalPublicIdentifier<{} & {} & { meta?: StaticDict<TAny> | undefined; } & { timeout: string; chainId: number; counterpartyIdentifier: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendDepositTx(params: OptionalPublicIdentifier<StaticProperties<{ channelAddress: TString; amount: TString; assetId: TString; chainId: TNumber; publicIdentifier: TString; }>>): Promise<Result<StaticProperties<{ txHash: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  reconcileDeposit(params: OptionalPublicIdentifier<{} & {} & { meta?: StaticDict<TAny> | undefined; } & { assetId: string; channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  requestCollateral(params: OptionalPublicIdentifier<{} & {} & { amount?: string | undefined; } & { assetId: string; channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  conditionalTransfer(params: OptionalPublicIdentifier<{} & {} & { timeout?: string | undefined; recipient?: string | undefined; meta?: StaticDict<TAny> | undefined; recipientChainId?: number | undefined; recipientAssetId?: string | undefined; } & { assetId: string; amount: string; channelAddress: string; type: string; details: StaticDict<TAny>; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; transferId: TString; routingId: TOptional<TString>; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  resolveTransfer(params: OptionalPublicIdentifier<{} & {} & { meta?: StaticDict<TAny> | undefined; } & { channelAddress: string; transferId: string; transferResolver: any; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; transferId: TString; routingId: TOptional<TString>; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  signUtilityMessage(params: OptionalPublicIdentifier<{} & {} & {} & { message: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ signedMessage: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendIsAliveMessage(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; skipCheckIn: boolean; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendDisputeChannelTx(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ txHash: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendDefundChannelTx(params: OptionalPublicIdentifier<{} & {} & {} & { channelAddress: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ txHash: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendDisputeTransferTx(params: OptionalPublicIdentifier<{} & {} & {} & { transferId: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ txHash: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  sendDefundTransferTx(params: OptionalPublicIdentifier<{} & {} & {} & { transferId: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ txHash: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  withdraw(params: OptionalPublicIdentifier<{} & {} & { callTo?: string | undefined; callData?: string | undefined; meta?: StaticDict<TAny> | undefined; fee?: string | undefined; } & { assetId: string; amount: string; channelAddress: string; recipient: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; transferId: TString; transactionHash: TOptional<TString>; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  restoreState(params: OptionalPublicIdentifier<{} & {} & {} & { chainId: number; counterpartyIdentifier: string; } & {} & {} & {} & { publicIdentifier: string; }>): Promise<Result<StaticProperties<{ channelAddress: TString; }>, NodeError>> {
    throw new Error("Method not implemented.");
  }
  once<T extends "IS_ALIVE" | "SETUP" | "CONDITIONAL_TRANSFER_CREATED" | "CONDITIONAL_TRANSFER_RESOLVED" | "DEPOSIT_RECONCILED" | "REQUEST_COLLATERAL" | "RESTORE_STATE_EVENT" | "WITHDRAWAL_CREATED" | "WITHDRAWAL_RESOLVED" | "WITHDRAWAL_RECONCILED">(event: T, callback: (payload: EngineEventMap[T]) => void | Promise<void>, filter?: (payload: EngineEventMap[T]) => boolean, publicIdentifier?: string): void {
    throw new Error("Method not implemented.");
  }
  on<T extends "IS_ALIVE" | "SETUP" | "CONDITIONAL_TRANSFER_CREATED" | "CONDITIONAL_TRANSFER_RESOLVED" | "DEPOSIT_RECONCILED" | "REQUEST_COLLATERAL" | "RESTORE_STATE_EVENT" | "WITHDRAWAL_CREATED" | "WITHDRAWAL_RESOLVED" | "WITHDRAWAL_RECONCILED">(event: T, callback: (payload: EngineEventMap[T]) => void | Promise<void>, filter?: (payload: EngineEventMap[T]) => boolean, publicIdentifier?: string): void {
    throw new Error("Method not implemented.");
  }
  off<T extends "IS_ALIVE" | "SETUP" | "CONDITIONAL_TRANSFER_CREATED" | "CONDITIONAL_TRANSFER_RESOLVED" | "DEPOSIT_RECONCILED" | "REQUEST_COLLATERAL" | "RESTORE_STATE_EVENT" | "WITHDRAWAL_CREATED" | "WITHDRAWAL_RESOLVED" | "WITHDRAWAL_RECONCILED">(event: T, publicIdentifier?: string): void {
    throw new Error("Method not implemented.");
  }
  waitFor<T extends "IS_ALIVE" | "SETUP" | "CONDITIONAL_TRANSFER_CREATED" | "CONDITIONAL_TRANSFER_RESOLVED" | "DEPOSIT_RECONCILED" | "REQUEST_COLLATERAL" | "RESTORE_STATE_EVENT" | "WITHDRAWAL_CREATED" | "WITHDRAWAL_RESOLVED" | "WITHDRAWAL_RECONCILED">(event: T, timeout: number, filter?: (payload: EngineEventMap[T]) => boolean, publicIdentifier?: string): Promise<EngineEventMap[T] | undefined> {
    throw new Error("Method not implemented.");
  }
}

