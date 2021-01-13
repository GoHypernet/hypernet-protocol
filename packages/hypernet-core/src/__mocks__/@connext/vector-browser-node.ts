import { BrowserNodeSignerConfig } from "@connext/vector-browser-node";
import { IRpcChannelProvider } from "@connext/vector-browser-node/dist/channelProvider";
import { EngineEvent, EngineEventMap, EngineEvents, EngineParams, FullChannelState, INodeService, NodeError, NodeParams, NodeResponses, OptionalPublicIdentifier, Result, TransferNames } from "@connext/vector-types";
import { getRandomBytes32, mkAddress, mkPublicIdentifier } from "@connext/vector-utils";
// import { constructRpcRequest, getRandomBytes32, hydrateProviders, NatsMessagingService } from "@connext/vector-utils";
import { soliditySha256 } from "ethers/lib/utils";
import pino from "pino";
import * as Factory from "factory.ts";

export const channelAddress = "test-channel";

const channelFactory = Factory.Sync.makeFactory<NodeResponses.GetChannelState>({
		assetIds: "asset1",
  	balances: "42",
	  channelAddress,
		alice: "taddress",
		bob: "baddress",
		merkleRoot: "Byetes",
		nonce: 3,
		processedDepositsA: ["213123"],
		processedDepositsB: ["hello"],
		timeout: "400",
		aliceIdentifier: "saf",
		bobIdentifier: "wfff",
		latestUpdate: {},
		networkContext: {},
});

export class BrowserNode implements INodeService {
  public channelProvider: IRpcChannelProvider | undefined;
  public publicIdentifier = mkPublicIdentifier();
  public signerAddress = mkAddress();
  private readonly logger: pino.BaseLogger;

  // SDK specific config
  private supportedChains: number[] = [];
  private routerPublicIdentifier?: string;
  private iframeSrc?: string;

  constructor(params: {
    logger?: pino.BaseLogger;
    routerPublicIdentifier?: string;
    supportedChains?: number[];
    iframeSrc?: string;
  }) {
    this.logger = params.logger || pino();
    this.routerPublicIdentifier = params.routerPublicIdentifier;
    this.supportedChains = params.supportedChains || [];
    this.iframeSrc = params.iframeSrc;
  }

  // method for signer-based connections
  static async connect(config: BrowserNodeSignerConfig): Promise<BrowserNode> {
    if (!config.logger) {
      config.logger = pino();
    }
    const node = new BrowserNode({ logger: config.logger });
    node.publicIdentifier = config.signer.publicIdentifier;
    node.signerAddress = config.signer.address;
    return node;
  }

  // method for non-signer based apps to connect to iframe
  async init(): Promise<void> {
    // TODO: validate config
    let iframeSrc = this.iframeSrc;
    if (!iframeSrc) {
      iframeSrc = "https://wallet.connext.network";
    }
    this.logger.info({ method: "connect", iframeSrc }, "Connecting with iframe provider");
    for (const chainId of this.supportedChains) {
      const channelRes = await this.getStateChannelByParticipants({
        chainId,
        counterparty: this.routerPublicIdentifier!,
      });
      if (channelRes.isError) {
        throw channelRes.getError();
      }
      let channel = channelRes.getValue();
      if (!channel) {
        this.logger.info({ chainId }, "Setting up channel");
        const address = await this.setup({
          chainId,
          counterpartyIdentifier: this.routerPublicIdentifier!,
          timeout: "100000",
        });
        if (address.isError) {
          throw address.getError();
        }
        channel = await this.getStateChannel(address.getValue());
      }
      this.logger.info({ channel, chainId });
    }
  }

  // IFRAME SPECIFIC
  async crossChainTransfer(params: {
    amount: string;
    fromChainId: number;
    fromAssetId: string;
    toChainId: number;
    toAssetId: string;
    reconcileDeposit?: boolean;
    withdrawalAddress?: string;
  }): Promise<void> {
    const senderChannelRes = await this.getStateChannelByParticipants({
      counterparty: this.routerPublicIdentifier!,
      chainId: params.fromChainId,
    });
    if (senderChannelRes.isError) {
      throw senderChannelRes.getError();
    }
    const receiverChannelRes = await this.getStateChannelByParticipants({
      counterparty: this.routerPublicIdentifier!,
      chainId: params.toChainId,
    });
    if (receiverChannelRes.isError) {
      throw receiverChannelRes.getError();
    }
    const senderChannel = senderChannelRes.getValue() as FullChannelState;
    const receiverChannel = receiverChannelRes.getValue() as FullChannelState;
    if (!senderChannel || !receiverChannel) {
      throw new Error(
        `Channel does not exist for chainId ${!senderChannel ? params.fromChainId : params.toChainId} with ${
          this.routerPublicIdentifier
        }`,
      );
    }

    if (params.reconcileDeposit) {
      const depositRes = await this.reconcileDeposit({
        assetId: params.fromAssetId,
        channelAddress: senderChannel.channelAddress,
      });
      if (depositRes.isError) {
        throw depositRes.getError();
      }
      const updated = await this.getStateChannel({ channelAddress: senderChannel.channelAddress });
      this.logger.info({ updated }, "Deposit reconciled");
    }

    const preImage = getRandomBytes32();
    const lockHash = soliditySha256(["bytes32"], [preImage]);
    this.logger.info({ preImage, lockHash }, "Sending cross-chain transfer");
    const transferParams = {
      amount: params.amount,
      assetId: params.fromAssetId,
      channelAddress: senderChannel.channelAddress,
      details: {
        lockHash,
        expiry: "0",
      },
      type: TransferNames.HashlockTransfer,
      recipient: this.publicIdentifier,
      recipientAssetId: params.toAssetId,
      recipientChainId: params.toChainId,
      meta: { ...params, reason: "Cross-chain transfer" },
    };
    const transferRes = await this.conditionalTransfer(transferParams);
    if (transferRes.isError) {
      throw transferRes.getError();
    }
    const senderTransfer = transferRes.getValue();
    this.logger.warn({ senderTransfer }, "Sender transfer successfully completed, waiting for receiver transfer...");
    const receiverTransferData = await this.waitFor(EngineEvents.CONDITIONAL_TRANSFER_CREATED, 60000, (data) => {
      if (
        data.transfer.meta.routingId === senderTransfer.routingId &&
        data.channelAddress === receiverChannel.channelAddress
      ) {
        return true;
      }
      return false;
    });
    if (!receiverTransferData) {
      this.logger.error(
        { routingId: senderTransfer.routingId, channelAddress: receiverChannel.channelAddress },
        "Failed to get receiver event",
      );
      return;
    }

    this.logger.info({ receiverTransferData }, "Received receiver transfer, resolving...");
    const resolveParams = {
      channelAddress: receiverChannel.channelAddress,
      transferId: receiverTransferData.transfer.transferId,
      transferResolver: {
        preImage,
      },
    };
    const resolveRes = await this.resolveTransfer(resolveParams);
    if (resolveRes.isError) {
      throw resolveRes.getError();
    }
    const resolvedTransfer = resolveRes.getValue();
    this.logger.info({ resolvedTransfer }, "Resolved receiver transfer");

    if (params.withdrawalAddress) {
      const withdrawalAmount = receiverTransferData.transfer.balance.amount[1];
      this.logger.info(
        { withdrawalAddress: params.withdrawalAddress, withdrawalAmount },
        "Withdrawing to configured address",
      );
      const withdrawRes = await this.withdraw({
        amount: withdrawalAmount, // bob is receiver
        assetId: params.toAssetId,
        channelAddress: receiverChannel.channelAddress,
        recipient: params.withdrawalAddress,
      });
      if (withdrawRes.isError) {
        throw withdrawRes.getError();
      }
      const withdrawal = withdrawRes.getValue();
      this.logger.info({ withdrawal }, "Withdrawal completed");
    }
  }
  //////////////////

  createNode(params: NodeParams.CreateNode): Promise<Result<NodeResponses.CreateNode, NodeError>> {
    return Promise.resolve(Result.fail(new NodeError(NodeError.reasons.MultinodeProhibitted, { params })));
  }

  async getConfig(): Promise<NodeResponses.GetConfig> {
    throw new Error("Method not implemented");
  }

  async getStatus(): Promise<Result<NodeResponses.GetStatus, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getStateChannelByParticipants(
    params: OptionalPublicIdentifier<NodeParams.GetChannelStateByParticipants>,
  ): Promise<Result<NodeResponses.GetChannelStateByParticipants, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getStateChannel(
    params: OptionalPublicIdentifier<NodeParams.GetChannelState>,
  ): Promise<Result<NodeResponses.GetChannelState, NodeError>> {
    return Result.ok([channelAddress]);
  }

  async getStateChannels(): Promise<Result<NodeResponses.GetChannelStates, NodeError>> {
    return Result.ok(channelFactory.buildList(1, {}))
  }

  async getTransferByRoutingId(
    params: OptionalPublicIdentifier<NodeParams.GetTransferStateByRoutingId>,
  ): Promise<Result<NodeResponses.GetTransferStateByRoutingId, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getTransfersByRoutingId(
    params: OptionalPublicIdentifier<NodeParams.GetTransferStatesByRoutingId>,
  ): Promise<Result<NodeResponses.GetTransferStatesByRoutingId, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getTransfer(
    params: OptionalPublicIdentifier<NodeParams.GetTransferState>,
  ): Promise<Result<NodeResponses.GetTransferState, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getActiveTransfers(
    params: OptionalPublicIdentifier<NodeParams.GetActiveTransfersByChannelAddress>,
  ): Promise<Result<NodeResponses.GetActiveTransfersByChannelAddress, NodeError>> {
    throw new Error("Method not implemented");
  }

  async getRegisteredTransfers(
    params: OptionalPublicIdentifier<NodeParams.GetRegisteredTransfers>,
  ): Promise<Result<NodeResponses.GetRegisteredTransfers, NodeError>> {
    throw new Error("Method not implemented");
  }

  async setup(
    params: OptionalPublicIdentifier<NodeParams.RequestSetup>,
  ): Promise<Result<NodeResponses.RequestSetup, NodeError>> {
    return Result.ok({channelAddress: ""});
  }

  // OK to leave unimplemented since browser node will never be Alice
  async internalSetup(): Promise<Result<NodeResponses.Setup, NodeError>> {
    throw new Error("Method not implemented");
  }

  // OK to leave unimplemented since all txes can be sent from outside the browser node
  async sendDepositTx(): Promise<Result<NodeResponses.SendDepositTx, NodeError>> {
    throw new Error("Method not implemented.");
  }

  async reconcileDeposit(
    params: OptionalPublicIdentifier<NodeParams.Deposit>,
  ): Promise<Result<NodeResponses.Deposit, NodeError>> {
    throw new Error("Method not implemented");
  }

  async requestCollateral(
    params: OptionalPublicIdentifier<NodeParams.RequestCollateral>,
  ): Promise<Result<NodeResponses.RequestCollateral, NodeError>> {
      throw new Error("Method not implemented");
  }

  async conditionalTransfer(
    params: OptionalPublicIdentifier<NodeParams.ConditionalTransfer>,
  ): Promise<Result<NodeResponses.ConditionalTransfer, NodeError>> {
    throw new Error("Method not implemented");
  }

  async resolveTransfer(
    params: OptionalPublicIdentifier<NodeParams.ResolveTransfer>,
  ): Promise<Result<NodeResponses.ResolveTransfer, NodeError>> {
    throw new Error("Method not implemented");
  }

  async withdraw(
    params: OptionalPublicIdentifier<NodeParams.Withdraw>,
  ): Promise<Result<NodeResponses.Withdraw, NodeError>> {
    throw new Error("Method not implemented");
  }

  async signUtilityMessage(
    params: OptionalPublicIdentifier<NodeParams.SignUtilityMessage>,
  ): Promise<Result<NodeResponses.SignUtilityMessage, NodeError>> {
    throw new Error("Method not implemented");
  }

  async send(payload: EngineParams.RpcRequest): Promise<any> {
    throw new Error("Method not implemented");
  }

  //////////////////////
  /// DISPUTE METHODS
  async sendDisputeChannelTx(
    params: OptionalPublicIdentifier<NodeParams.SendDisputeChannelTx>,
  ): Promise<Result<NodeResponses.SendDisputeChannelTx, NodeError>> {
    throw new Error("Method not implemented");
  }

  async sendDefundChannelTx(
    params: OptionalPublicIdentifier<NodeParams.SendDefundChannelTx>,
  ): Promise<Result<NodeResponses.SendDefundChannelTx, NodeError>> {
    throw new Error("Method not implemented");
  }

  async sendDisputeTransferTx(
    params: OptionalPublicIdentifier<NodeParams.SendDisputeTransferTx>,
  ): Promise<Result<NodeResponses.SendDisputeTransferTx, NodeError>> {
    throw new Error("Method not implemented");
  }

  async sendDefundTransferTx(
    params: OptionalPublicIdentifier<NodeParams.SendDefundTransferTx>,
  ): Promise<Result<NodeResponses.SendDefundTransferTx, NodeError>> {
    throw new Error("Method not implemented");
  }

  waitFor<T extends EngineEvent>(
    event: T,
    timeout: number,
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): Promise<EngineEventMap[T] | undefined> {
    throw new Error("TODO");
    // return this.engine.waitFor(event, timeout, filter);
  }

  async once<T extends EngineEvent>(
    event: T,
    callback: (payload: EngineEventMap[T]) => void | Promise<void>,
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): Promise<void> {
    return this.channelProvider!.once(event, callback, filter);
  }

  async on<T extends EngineEvent>(
    event: T,
    callback: (payload: EngineEventMap[T]) => void | Promise<void>,
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): Promise<void> {
    return this.channelProvider!.on(event, callback, filter);
  }

  async off<T extends EngineEvent>(event: T): Promise<void> {
    throw new Error("TODO");
    // return this.engine.off(event);
  }
}
