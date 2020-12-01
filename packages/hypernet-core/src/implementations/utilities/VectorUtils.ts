import { FullChannelState, NodeParams, OptionalPublicIdentifier, NodeResponses } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata, PullAmount } from "@interfaces/objects";
import { IBrowserNodeProvider, IContextProvider, IVectorUtils, IConfigProvider } from "@interfaces/utilities";
import { EPaymentType, InsuranceState, MessageState, ParameterizedState } from "@interfaces/types";
import { serialize } from "class-transformer";
import { ethers } from "ethers";
import { Rate } from "@interfaces/types/transfers/ParameterizedTypes";

export class VectorUtils implements IVectorUtils {
  protected channelAddress: string | null;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected browserNodeProvider: IBrowserNodeProvider,
  ) {
    this.channelAddress = null;
  }

  public async resolveMessageTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer> {
    throw new Error("Method not yet implemented.");
  }

  public async resolvePaymentTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer> {
    throw new Error("Method not yet implemented.");
  }

  public async resolveInsuranceTransfer(transferId: string): Promise<NodeResponses.ResolveTransfer> {
    throw new Error("Method not yet implemented.");
  }

  /**
   *
   */
  public async createMessageTransfer(
    toAddress: string,
    message: IHypernetTransferMetadata,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();

    let initialState: MessageState = {
      message: serialize(message),
    };

    // Create transfer params
    let transferParams = {
      recipient: toAddress,
      channelAddress: channelAddress,
      amount: "0",
      assetId: config.hypertokenAddress,
      type: 'MessageTransfer',
      details: initialState,
      meta: message
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>

    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`
        Could not complete transfer, browser node threw an error:
        ${transfer.getError()}
        transferParams: ${JSON.stringify(transferParams)}  
      `)
    }

    let transferResult = transfer.getValue();

    return transferResult;
  }

  /**
   *
   * @param amount the amount of payment to send
   * @param assetAddress the address of the asset to send
   * @returns a NodeResponses.ConditionalTransfer event, which contains the channel address and the transfer ID
   */
  public async createPaymentTransfer(
    type: EPaymentType,
    toAddress: string,
    amount: BigNumber,
    assetAddress: string,
    UUID: string,
    start: string,
    expiration: string,
    rate?: Rate,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();

    if (type == EPaymentType.Pull && rate == null) {
      throw new Error("Must provide rate for PullPaymentTransfer");
    }

    let infinite_rate = {
      deltaAmount: ethers.constants.MaxUint256.toString(),
      deltaTime: "1",
    };

    let initialState: ParameterizedState = {
      receiver: toAddress,
      start: start,
      expiration: expiration,
      UUID: UUID,
      rate: type == EPaymentType.Push ? infinite_rate : (rate as Rate),
    };

    // Create transfer params
    let transferParams = {
      channelAddress: channelAddress,
      amount: amount.toString(),
      assetId: assetAddress,
      type: "Parameterized",
      details: initialState,
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`Could not complete transfer, browser node threw an error: ${transfer.getError()}`)
    }

    let transferResult = transfer.getValue();

    return transferResult;
  }

  /**
   *
   */
  public async createInsuranceTransfer(
    toAddress: string,
    mediatorAddress: string,
    amount: BigNumber,
    expiration: string,
    UUID: string,
  ): Promise<NodeResponses.ConditionalTransfer> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.getRouterChannelAddress();
    const config = await this.configProvider.getConfig();

    let initialState: InsuranceState = {
      receiver: toAddress,
      mediator: mediatorAddress,
      collateral: amount.toString(),
      expiration: expiration,
      UUID: UUID,
    };

    // Create transfer params
    let transferParams = {
      channelAddress: channelAddress,
      amount: amount.toString(),
      assetId: config.hypertokenAddress,
      type: "Insurance",
      details: initialState,
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>;

    let transfer = await browserNode.conditionalTransfer(transferParams);

    if (transfer.isError) {
      throw new Error(`Could not complete transfer, browser node threw an error: ${transfer.getError()}`)
    }

    let transferResult = transfer.getValue();

    return transferResult;
  }

  /**
   *
   */
  public async getRouterChannelAddress(): Promise<string> {
    // If we already have the address, no need to do the rest
    if (this.channelAddress != null) {
      return this.channelAddress;
    }

    // Basic setup
    const configPromise = this.configProvider.getConfig();
    const contextPromise = this.contextProvider.getInitializedContext();
    const browserNodePromise = this.browserNodeProvider.getBrowserNode();
    const [config, context, browserNode] = await Promise.all([configPromise, contextPromise, browserNodePromise]);

    console.log(`publicIdentifier: ${context.publicIdentifier}`);
    console.log(`routerPublicIdentifier: ${config.routerPublicIdentifier}`);

    // We need to see if we already have a channel with the router setup.
    // const channelsByParticipantResult = await browserNode.getStateChannelByParticipants({
    //   publicIdentifier: context.publicIdentifier,
    //   counterparty: config.routerPublicIdentifier,
    //   chainId: config.chainId,
    // });

    const channelsResult = await browserNode.getStateChannels();

    // if (channelsByParticipantResult.isError) {
    //   throw new Error("Cannot get channels!");
    // }

    if (channelsResult.isError) {
      throw new Error("Cannot get channels 2!");
    }
    // const channelsByParticipants = channelsByParticipantResult.getValue();
    const channels2 = channelsResult.getValue();

    // console.log(channelsByParticipants);
    console.log(channels2);

    let channel: FullChannelState | null = null;
    for (const channelAddress of channels2) {
      const channelResult = await browserNode.getStateChannel({ channelAddress });
      if (channelResult.isError) {
        throw new Error("Cannot get details of state channel!");
      }

      channel = channelResult.getValue();

      if (channel != null) {
        console.log(channel);
        if (channel.aliceIdentifier !== config.routerPublicIdentifier) {
          continue;
        }
        this.channelAddress = channel.channelAddress;
        return this.channelAddress;
      }
    }

    // If a channel does not exist with the router, we need to create it.
    const setupResult = await browserNode.setup({
      chainId: 1337,
      counterpartyIdentifier: config.routerPublicIdentifier,
      timeout: "8640",
    });

    if (setupResult.isError) {
      console.log(setupResult.getError());
      throw new Error("Cannot establish channel with router!");
    }

    const newChannel = setupResult.getValue();
    console.log(newChannel);

    this.channelAddress = newChannel.channelAddress;
    return this.channelAddress;
  }
}
