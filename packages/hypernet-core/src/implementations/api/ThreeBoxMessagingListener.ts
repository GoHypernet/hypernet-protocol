import { ILinkService } from "@interfaces/business/ILinkService";
import { IMessagingListener } from "@interfaces/api/IMessagingListener";
import { Message, HypernetLink } from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { BoxThreadPost } from "3box";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";

export class ThreeBoxMessagingListener implements IMessagingListener {
  constructor(
    protected channelService: ILinkService,
    protected boxUtils: IThreeBoxUtils,
    protected configProvider: IConfigProvider,
  ) {}

  public async initialize() {
    // Listen for 3Box
    // For each open channel, we need to join the thread
    const channels = await this.channelService.getActiveLinks();

    const channelIds = new Array<string>();
    for (const channel of channels) {
      channelIds.push(channel.id);
    }

    // Get all the threads
    const config = await this.configProvider.getConfig();
    const threads = await this.boxUtils.getThreads(config.spaceName, channelIds);

    for (const thread of threads) {
      const threadAddress = thread.address;
      thread.onUpdate((post: BoxThreadPost) => {
        const channel = channels.find((val: HypernetLink) => {
          return val.threadAddress === threadAddress;
        });

        if (channel == null) {
          throw new Error("No channel associated with the thread. This really shouldn't happen!");
        }
        const message = JSON.parse(post.message) as Message;
        this.channelService.messageRecieved(channel.id, message);
      });
    }
  }
}
