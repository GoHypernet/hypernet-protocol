import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BrowserNode, BrowserNodeConfig } from "@connext/vector-browser-node";
import pino from "pino";
import { IContextProvider } from "@interfaces/utilities";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected logger: pino.Logger;
  protected browserNode: Promise<BrowserNode> | null;

  constructor(protected configProvider: IConfigProvider, protected contextProvider: IContextProvider) {
    this.logger = pino();
    this.browserNode = null;
  }

  protected async initialize(): Promise<BrowserNode> {
    const config = await this.configProvider.getConfig();
    const context = await this.contextProvider.getContext();

    if (context.privateKey == null) {
      throw new Error("Account mnemonic must be established first!");
    }

    return await BrowserNode.connect({
      iframeSrc: config.iframeSource,
      logger: this.logger,
    } as BrowserNodeConfig);
  }
  public async getBrowserNode(): Promise<BrowserNode> {
    if (this.browserNode == null) {
      this.browserNode = this.initialize();
    }

    return this.browserNode;
  }
}
