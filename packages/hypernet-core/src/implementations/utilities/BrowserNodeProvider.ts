import { IBrowerNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import {BrowserNode} from "@connext/vector-browser-node";
import { ChannelSigner } from "@implementations/utilities/ChannelSigner";
import pino from "pino";

import { Wallet, constants } from "ethers";

export class BrowerNodeProvider implements IBrowerNodeProvider {
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

        return await BrowserNode.connect(config.natsUrl,
          this.logger,
          this.channelSigner,
          config.chainProviders,
          config.chainAddresses)
    }
    public async getBrowserNode(): Promise<BrowserNode> {
        if (this.browserNode == null) {
            this.browserNode = this.initialize();
        }

        return this.browserNode;
    }
}