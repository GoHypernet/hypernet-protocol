import { FullChannelState, FullTransferState, PublicIdentifier } from "@connext/vector-types";
import { IHypernetTransferMetadata } from "@interfaces/objects";
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

  public async createNullTransfer(
    counterParty: PublicIdentifier,
    metadata: IHypernetTransferMetadata,
  ): Promise<FullTransferState> {
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
    for (let channelAddress of channels2) {
      const channelResult = await browserNode.getStateChannel({ channelAddress: channelAddress });
      if (channelResult.isError) {
        throw new Error("Cannot get details of state channel!");
      }

      channel = channelResult.getValue();

      if (channel != null) {
        console.log(channel);
        if (channel.aliceIdentifier != config.routerPublicIdentifier) {
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
