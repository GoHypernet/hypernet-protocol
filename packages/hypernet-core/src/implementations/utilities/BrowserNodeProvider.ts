import { IBrowerNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import {BrowserNode} from "@connext/vector-browser-node";
import { ChannelSigner } from "@connext/vector-utils";
import pino from "pino";
import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";

export class BrowerNodeProvider implements IBrowerNodeProvider {
    protected browserNode: BrowserNode | undefined;
    protected channelSigner: ChannelSigner | undefined
    protected logger: pino.Logger;
    protected initialized: Promise<void> | undefined;

    constructor(protected configProvider: IConfigProvider, 
        protected web3Provider: IWeb3Provider ) {
        this.logger = pino();
        
    }

    protected async initialize(): Promise<void> {
        const config = await this.configProvider.getConfig();

        const provider = await this.web3Provider.getProvider();
        this.channelSigner = new ChannelSigner("", provider);

        this.browserNode = await BrowserNode.connect(config.natsUrl,
          this.logger,
          this.channelSigner,
          config.authUrl,
          config.chainProviders,
          config.chainAddresses,)
    }
    public async getBrowserNode(): Promise<BrowserNode> {
        await this.lazyLoad();

        return this.browserNode;
    }

    protected async lazyLoad(): Promise<void> {
        if (this.initialized == null) {
            this.initialized = this.initialize();
        }

        return this.initialized;
    }
}