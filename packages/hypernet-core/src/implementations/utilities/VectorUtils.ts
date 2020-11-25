import { Balance, FullChannelState, FullTransferState, PublicIdentifier, CreateTransferParams, TransferNames, HashlockTransferName, NodeParams, OptionalPublicIdentifier, Result, NodeResponses, TransferState, HashlockTransferState } from "@connext/vector-types";
import { BigNumber, IHypernetTransferMetadata } from "@interfaces/objects";
import { IBrowserNodeProvider, IContextProvider, IVectorUtils, IConfigProvider } from "@interfaces/utilities";

export class VectorUtils implements IVectorUtils {
  protected channelAddress: string | null;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected browserNodeProvider: IBrowserNodeProvider,
  ) {
    this.channelAddress = null;
  }

  /**
   * 
   */
  public async createNullTransfer(
  ): Promise<NodeResponses.ConditionalTransfer> {
    throw new Error("Method not yet implemented");
  }

  /**
   * 
   * @param amount 
   * @param assetAddress 
   * @returns a NodeResponses.ConditionalTransfer event, which contains the channel address and the transfer ID
   */
  public async createPaymentTransfer(
    toAddress: string,
    amount: BigNumber,
    assetAddress: string
  ): Promise<NodeResponses.ConditionalTransfer> {

    const browserNode = await this.browserNodeProvider.getBrowserNode()
    const channelAddress = await this.getRouterChannelAddress()


    let initialState: TransferState = {
      // @todo switch this to a ParameterizedTransferState and fill in once we import the types
    }

    // Create transfer params
    let transferParams = {
      channelAddress: channelAddress,
      amount: amount.toString(),
      assetId: assetAddress,
      type: 'Parameterized',
      details: initialState // initial state goes here // but not initialbalance like the tests
    } as OptionalPublicIdentifier<NodeParams.ConditionalTransfer>
  
    let transfer = await browserNode.conditionalTransfer(transferParams)

    if (transfer.isError) {
      throw new Error('Could not complete transfer, browser node threw an error.')
    }

    let transferResult = transfer.getValue()

    return transferResult
  }

  public async createInsuranceTransfer(): Promise<NodeResponses.ConditionalTransfer> {
    throw new Error("Method not yet implemented");
  }

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
    const channelsByParticipantResult = await browserNode.getStateChannelByParticipants({
      publicIdentifier: context.publicIdentifier,
      counterparty: config.routerPublicIdentifier,
      chainId: config.chainId,
    });

    const channelsResult = await browserNode.getStateChannels();

    if (channelsByParticipantResult.isError) {
      throw new Error("Cannot get channels!");
    }

    if (channelsResult.isError) {
      throw new Error("Cannot get channels 2!");
    }
    const channelsByParticipants = channelsByParticipantResult.getValue();
    const channels2 = channelsResult.getValue();

    console.log(channelsByParticipants);
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
