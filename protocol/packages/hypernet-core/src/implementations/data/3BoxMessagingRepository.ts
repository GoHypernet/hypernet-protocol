import { IMessagingRepository } from "@interfaces/data";
import {
  Message,
  MessageThread,
  EthereumAddress,
  ThreadMetadata,
  EstablishLinkRequest,
  MessagePayload,
  ControlClaim,
} from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { ELinkRole, EMessageType } from "@interfaces/types";
import { plainToClass, serialize } from "class-transformer";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";

export class ThreeBoxMessagingRepository implements IMessagingRepository {
  constructor(
    protected boxUtils: IThreeBoxUtils,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
  ) {}

  public async createMessageThread(
    threadName: string,
    localUser: EthereumAddress,
    remoteUser: EthereumAddress,
  ): Promise<MessageThread> {
    const openThreads = await this.getThreadMetadata();
    const existingThread = await this.getExistingThread(openThreads, remoteUser);
    if (existingThread != null) {
      return existingThread;
    }

    // No existing thread between these two users.
    // We're doing a Members Confidential thread, so other people can't
    // see what we're sending
    const config = await this.configProvider.getConfig();
    const space = await this.boxUtils.getHypernetProtocolSpace();
    const thread = await space.createConfidentialThread(threadName);

    // Current user is one part of the thread, need to add the other user
    await thread.addMember(remoteUser);

    // Store the new thread metadata
    openThreads.push(new ThreadMetadata(thread.address, remoteUser));
    space.private.set(config.openThreadKey, serialize(openThreads));

    return new MessageThread(thread.address, localUser, remoteUser, []);
  }

  public async getMessageThread(address: string): Promise<MessageThread> {
    // Get the list of open threads
    const threadMetadata = await this.getThreadMetadata();

    // If the requested thread is not in the list, then that's a problem
    const existingThreadMetadata = threadMetadata.filter((val) => {
      return val.address === address;
    });

    if (existingThreadMetadata.length < 1) {
      throw new Error(`Thread ${address} does not exist!`);
    }

    // Threads exist in the basic hypernet protocol space
    const space = await this.boxUtils.getHypernetProtocolSpace();

    // Join the thread
    const thread = await space.joinThreadByAddress(address);

    // Get all the posts in the thread
    const posts = await thread.getPosts();

    // Convert the remaining posts to messages
    const messages = posts.map((post) => {
      // TODO: Determine if we need to convert the message to an object or something else.
      // We might be able to strongly type the data for a Message.
      return new Message(post.author, post.timestamp, post.message);
    });

    const context = await this.contextProvider.getContext();
    if (context.account == null) {
      throw new Error("Can not get message threads until we know who we are!");
    }

    return new MessageThread(address, context.account, existingThreadMetadata[0].userAddress, messages);
  }

  public async getMessageThreadAddresses(): Promise<string[]> {
    // Threads exist in the basic hypernet protocol space
    const space = await this.boxUtils.getHypernetProtocolSpace();

    return space.subscribedThreads();
  }

  public async sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void> {
    // Get the message thread the user wants to use
    const metadata = await this.getThreadMetadata();

    const existingThreadMetadata = metadata.filter((val) => {
      return val.userAddress === destination;
    });
    if (existingThreadMetadata.length < 1) {
      throw new Error(`No existing thread established to reach destination ${destination}`);
    }
    const threadMetadataToUse = existingThreadMetadata[0];
    const threads = await this.boxUtils.getThreads([threadMetadataToUse.address]);
    const thread = threads[threadMetadataToUse.address];

    // Send the payload
    await thread.post(serialize(payload));
  }

  public async sendEstablishLinkRequest(request: EstablishLinkRequest): Promise<void> {
    // We just need to post into the discovery thread
    const discoveryThread = await this.boxUtils.getDiscoveryThread();

    await discoveryThread.post(serialize(request));
  }

  public async sendDenyLinkResponse(linkRequest: EstablishLinkRequest): Promise<void> {
    // Get the message thread the user wants to user
    const threads = await this.boxUtils.getThreads([linkRequest.threadAddress]);
    const thread = threads[linkRequest.threadAddress];

    // Send a deny message
    const payload = new MessagePayload(EMessageType.DENY_LINK, serialize(linkRequest));
    await thread.post(serialize(payload));
  }

  public async sendControlClaim(controlClaim: ControlClaim): Promise<void> {
    const controlThread = await this.boxUtils.getControlThread();

    await controlThread.post(serialize(controlClaim));
  }

  protected async getExistingThread(
    openThreads: ThreadMetadata[],
    remoteUser: EthereumAddress,
  ): Promise<MessageThread | null> {
    const existingThreads = openThreads.filter((val) => {
      return val.userAddress === remoteUser;
    });

    if (existingThreads.length > 0) {
      // Already have a message thread for this
      return this.getMessageThread(existingThreads[0].address);
    }

    return null;
  }

  protected async getThreadMetadata(): Promise<ThreadMetadata[]> {
    // The thread metadata exists in the basic space
    const space = await this.boxUtils.getHypernetProtocolSpace();

    // Check if we already have a thread created between these two people.
    const config = await this.configProvider.getConfig();
    const openThreadString = await space.private.get(config.openThreadKey);
    if (openThreadString == null || openThreadString === "") {
      return [];
    }

    const openThreadObjects = JSON.parse(openThreadString) as object[];

    return openThreadObjects.map((plainLink) => {
      return plainToClass(ThreadMetadata, plainLink);
    });
  }
}
