import { BoxInstance, create, BoxSpace, BoxThread } from "3box";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import { Address } from "@interfaces/objects";

export class ThreeBoxUtils implements IThreeBoxUtils {
    protected box: BoxInstance | null;
    protected privateSpace: BoxSpace | null;
    protected web3Provider: IWeb3Provider;
    protected etheriumAccounts: string[];
    protected spaces: { [spaceName: string]: BoxSpace };
    protected threads: { [threadAddress: string]: BoxThread };

    // tslint:disable-next-line: no-shadowed-variable
    public constructor(IWeb3Provider: IWeb3Provider) {
        this.web3Provider = IWeb3Provider;
        this.box = null;
        this.privateSpace = null;
        this.etheriumAccounts = [];
        this.spaces = {};
        this.threads = {};
    }

    public async getBox(): Promise<BoxInstance> {
        if (this.box != null) {
            return this.box;
        }

        const web3 = await this.web3Provider.getWeb3();

        this.etheriumAccounts = await web3.eth.getAccounts();

        this.box = await create(web3.currentProvider);

        // await this.box.syncDone;

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

        // Need to auth some more spaces
        const box = await this.getBox();

        await box.auth(spacesToAuth, { address: this.etheriumAccounts[0] });

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

    public async getThreads(spaceName: string, threadAddresses: Address[]): Promise<BoxThread[]> {
        
        const returnThreads = new Array<BoxThread>();
        const threadsToJoin = new Array<Address>();

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
}
