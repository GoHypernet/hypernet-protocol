import { ILinkService } from "@interfaces/business/ILinkService";
import { IMessagingListener } from "@interfaces/api/IMessagingListener";
import { EstablishLinkRequest, MessagePayload } from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { BoxThreadPost } from "3box";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { IMessageService } from "@interfaces/business/IMessageService";
import { plainToClass } from "class-transformer";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";

export class ThreeBoxMessagingListener implements IMessagingListener {
  constructor(
    protected linkService: ILinkService,
    protected messageService: IMessageService,
    protected boxUtils: IThreeBoxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
  ) {}

  public async initialize() {
    const config = await this.configProvider.getConfig();

    const discoveryThread = await this.boxUtils.getDiscoveryThread();

    const did = await this.boxUtils.getDID();

    // we need to process any messages that may have occured while we
    // were gone.
    const posts = await discoveryThread.getPosts();
    const linkRequests = new Array<EstablishLinkRequest>();
    for (const post of posts) {
      // Discard posts that we sent
      if (post.author === did) {
        console.log("Discarding message sent by us", post.author);
        continue;
      }

      // In the discovery thread, all posts should be the same format
      const plain = JSON.parse(post.message) as object;
      const linkRequest = plainToClass(EstablishLinkRequest, plain);
      linkRequests.push(linkRequest);
    }
    this.linkService.processEstablishLinkRequests(linkRequests);

    discoveryThread.onUpdate(async (post) => {
      // Discard posts that we sent
      if (post.author === did || post.type === "backlog") {
        console.log("Discarding message sent by us", post.author);
        return;
      }

      // In the discovery thread, all posts should be the same format
      const plain = JSON.parse(post.message) as object;
      const linkRequest = plainToClass(EstablishLinkRequest, plain);

      this.linkService.processEstablishLinkRequests([linkRequest]);
    });

    // For each open link, we need to join the thread
    const links = await this.linkService.getActiveLinks();

    // Map to just the thread addresses
    const threadAddresses = links
      .filter((val) => {
        return val.threadAddress != null;
      })
      .map((val) => {
        return val.threadAddress;
      }) as string[];

    // Get all the threads
    const threads = await this.boxUtils.getThreads(threadAddresses);

    for (const [, thread] of Object.entries(threads)) {
      thread.onUpdate(async (post: BoxThreadPost) => {
        console.log("3Box message received");
        const plain = JSON.parse(post.message) as object;
        const message = plainToClass(MessagePayload, plain);
        this.messageService.messageRecieved(message);
      });
    }
  }
}
