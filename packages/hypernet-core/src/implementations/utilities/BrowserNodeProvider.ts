import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BrowserNode } from "@connext/vector-browser-node";
import { IContextProvider, ILogUtils } from "@interfaces/utilities";
import { NodeError } from "@connext/vector-types";
import { ResultAsync } from "neverthrow";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNode: ResultAsync<BrowserNode, NodeError | Error> | null;

  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {
    this.browserNode = null;
  }

  protected initialize(): ResultAsync<BrowserNode, NodeError | Error> {
    this.browserNode = this.configProvider.getConfig().map(async (config) => {
      const browserNode = new BrowserNode({
        iframeSrc: config.iframeSource,
        logger: this.logUtils.getPino(),
      });

      await browserNode.init();
      return browserNode;
    });

    return this.browserNode;
  }

  public getBrowserNode(): ResultAsync<BrowserNode, NodeError | Error> {
    return this.initialize();
  }
}
