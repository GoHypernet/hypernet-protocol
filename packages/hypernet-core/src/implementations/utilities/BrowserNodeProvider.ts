import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import {BrowserNode, BrowserNodeConfig} from "@connext/vector-browser-node";
import { ChannelSigner } from "@implementations/utilities/ChannelSigner";
import pino from "pino";

import { Wallet } from "ethers";

export class BrowserNodeProvider implements IBrowserNodeProvider {
    protected channelSigner: ChannelSigner | null
    protected logger: pino.Logger;
    protected browserNode: Promise<BrowserNode> | null;

    constructor(protected configProvider: IConfigProvider) {
        this.logger = pino();
        this.browserNode = null;
        this.channelSigner = null;
    }

    protected async initialize(): Promise<BrowserNode> {
        const config = await this.configProvider.getConfig();

        const wallet = Wallet.fromMnemonic(config.mnemonic);
        this.channelSigner = new ChannelSigner(wallet.privateKey);
        console.log(`Signer from mnemonic: ${this.channelSigner.publicIdentifier}`);

        return await BrowserNode.connect({
            chainAddresses: config.chainAddresses,
            chainProviders: config.chainProviders,
            logger: this.logger,
            authUrl: config.authUrl,
            natsUrl: config.natsUrl,
            signer: this.channelSigner,
          } as BrowserNodeConfig)
    }
    public async getBrowserNode(): Promise<BrowserNode> {
        if (this.browserNode == null) {
            this.browserNode = this.initialize();
        }

        return this.browserNode;
    }
}