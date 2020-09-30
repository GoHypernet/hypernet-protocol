import "@statechannels/iframe-channel-provider";
import { IFrameChannelProviderInterface } from "@statechannels/iframe-channel-provider";
import "@statechannels/channel-client";
import { IChannelClientProvider } from "@interfaces/utilities/IChannelClientProvider";
import { IStateChannelRepository } from "@interfaces/data";
import { EthereumAddress } from "@interfaces/objects";
import {
  Message as NitroMessage,
  Participant as IParticipant,
  FundingStrategy,
} from "@statechannels/client-api-schema";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { ChannelResult } from "@statechannels/channel-client";

declare global {
  interface Window {
    channelProvider: IFrameChannelProviderInterface;
  }
}

export class StateChannelsRepository implements IStateChannelRepository {
  protected channelProviderEnabled: boolean = false;

  constructor(protected channelClientProvider: IChannelClientProvider, protected configProvider: IConfigProvider) {}

  public async initialize() {
    const config = await this.configProvider.getConfig();

    window.channelProvider.mountWalletComponent(config.xstateWalletUrl);

    this.assureEnabled();
  }

  public async pushMessage(message: string): Promise<void> {
    console.log("pushMessage in repository");
    // This is probably not necessary here, leaving it in for example for later
    await this.assureEnabled();

    const channelClient = this.channelClientProvider.getChannelClient();

    // We need to convert the internal message to a nitro message.

    try {
      console.log(message);
      const nitroMessage = (message as unknown) as NitroMessage;
      const result = await channelClient.pushMessage(nitroMessage);
    } catch (e) {
      // tslint:disable-next-line: no-empty
    }
  }

  public async createChannel(consumer: EthereumAddress, providerAddress: EthereumAddress): Promise<string> {
    await this.assureEnabled();

    const channelClient = await this.channelClientProvider.getChannelClient();
    const config = await this.configProvider.getConfig();

    const consumerParticipant = {
      participantId: consumer,
      signingAddress: consumer,
      destination: providerAddress,
    } as IParticipant;

    const providerParticipant = {
      participantId: providerAddress,
      signingAddress: providerAddress,
      destination: consumer,
    } as IParticipant;

    const appData = "";

    const channelResult = await channelClient.createChannel(
      [consumerParticipant, providerParticipant],
      [],
      config.forceMoveAppAddress,
      appData,
      "Direct",
    );

    return channelResult.channelId;
  }

  public async joinChannel(channelId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  protected async assureEnabled(): Promise<void> {
    if (!this.channelProviderEnabled) {
      await window.channelProvider.enable();
      this.channelProviderEnabled = true;
    }
  }
}
