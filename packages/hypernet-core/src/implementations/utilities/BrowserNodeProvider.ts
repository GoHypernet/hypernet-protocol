import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BrowserNode, BrowserNodeConfig } from "@connext/vector-browser-node";
import pino from "pino";
import { IContextProvider } from "@interfaces/utilities";
import { NodeResponses } from "@connext/vector-types";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected logger: pino.Logger;
  protected browserNode: Promise<BrowserNode> | null;

  constructor(protected configProvider: IConfigProvider, protected contextProvider: IContextProvider) {
    this.logger = pino();
    this.browserNode = null;
  }

  protected async initialize(): Promise<BrowserNode> {
    const config = await this.configProvider.getConfig();

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