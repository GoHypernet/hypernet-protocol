import { ChannelClient } from "@statechannels/channel-client";

export interface IChannelClientProvider {
  getChannelClient(): ChannelClient;
}
