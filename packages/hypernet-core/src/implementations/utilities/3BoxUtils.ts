import { BoxInstance, create, BoxSpace, BoxThread } from "3box";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { EthereumAddress } from "@interfaces/objects";
import { IContextProvider } from "@interfaces/utilities/IContextProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";

export class ThreeBoxUtils implements IThreeBoxUtils {
  protected box: BoxInstance | null;
  protected privateSpace: BoxSpace | null;
  protected ethereumAccounts: string[];
  protected spaces: { [spaceName: string]: BoxSpace };
  protected threads: { [threadAddress: string]: BoxThread };

  public constructor(
    protected web3Provider: IWeb3Provider,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
  ) {
    this.box = null;
    this.privateSpace = null;
    this.ethereumAccounts = [];
    this.spaces = {};
    this.threads = {};
  }

  public async getBox(account: string): Promise<BoxInstance> {
    if (this.box != null) {
      return this.box;
    }

    const web3 = await this.web3Provider.getWeb3();

    this.box = await create(web3.currentProvider);

    // Don't do anything until the sync is complete
    await this.box.syncDone;

    return this.box;
  }

  public async getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }> {
    const returnSpaces: { [spaceName: string]: BoxSpace } = {};
    const spacesToAuth = new Array<string>();

    for (const spaceName of spaceNames) {
      if (this.spaces[spaceName] == null) {
        // Need to auth the space
        spacesToAuth.push(spaceName);
      } else {
        returnSpaces[spaceName] = this.spaces[spaceName];
      }
    }

    if (spacesToAuth.length === 0) {
      // All the spaces are already authed and in the cache.
      return returnSpaces;
    }

    const context = await this.contextProvider.getContext();

    // Need to auth some more spaces
    if (context.account == null) {
      throw new Error("Must have an established account!");
    }

    const box = await this.getBox(context.account);

    await box.auth(spacesToAuth, { address: context.account });

    // Now start the process of opening each of the spaces
    const newSpacePromises: { [spaceName: string]: Promise<BoxSpace> } = {};

    // Start the process of opening all the spaces.
    for (const spaceName of spacesToAuth) {
      newSpacePromises[spaceName] = box.openSpace(spaceName);
    }

    // Loop over the spaces
    for (const [key, value] of Object.entries(newSpacePromises)) {
      const space = await value;

      // Add it to the cache
      this.spaces[key] = space;

      // Add it to the return
      returnSpaces[key] = space;
    }

    return returnSpaces;
  }

  public async getHypernetProtocolSpace(): Promise<BoxSpace> {
    const config = await this.configProvider.getConfig();

    // Get the main space, the list of channels is here.
    const spaces = await this.getSpaces([config.spaceName]);
    return spaces[config.spaceName];
  }

  public async getThreads(spaceName: string, threadAddresses: EthereumAddress[]): Promise<BoxThread[]> {
    const returnThreads = new Array<BoxThread>();
    const threadsToJoin = new Array<EthereumAddress>();

    for (const threadAddress of threadAddresses) {
      if (this.threads[threadAddress] == null) {
        // Need to join the thread
        threadsToJoin.push(threadAddress);
      } else {
        returnThreads.push(this.threads[threadAddress]);
      }
    }

    if (threadsToJoin.length === 0) {
      // All the threads are already joined
      return returnThreads;
    }

    // Need to join some more threads
    // First get the thread space, which is probably the channel ID
    const space = (await this.getSpaces([spaceName]))[spaceName];

    // Now start the process of joining each of the threads
    const newThreadPromises: { [threadName: string]: Promise<BoxThread> } = {};

    for (const threadAddress of threadsToJoin) {
      newThreadPromises[threadAddress] = space.joinThreadByAddress(threadAddress);
    }

    // Loop over the threads
    for (const [threadAddress, threadPromise] of Object.entries(newThreadPromises)) {
      const thread = await threadPromise;

      // Add it to the cache
      this.threads[threadAddress] = thread;

      // Add it to the return
      returnThreads.push(thread);
    }

    return returnThreads;
  }

  public async getDiscoveryThread(): Promise<BoxThread> {
    const config = await this.configProvider.getConfig();
    const spaces = await this.getSpaces([config.spaceName]);
    const space = spaces[config.spaceName];

    return space.joinThread(config.discoveryThreadName, {
      ghost: true,
      ghostBacklogLimit: 50,
    });
  }
}
