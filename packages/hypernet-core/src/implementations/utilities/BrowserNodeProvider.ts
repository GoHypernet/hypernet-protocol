import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BrowserNode } from "@connext/vector-browser-node";
import { IBrowserNode, IContextProvider, ILogUtils } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";
import { WrappedBrowserNode } from "./WrappedBrowserNode";
import { VectorError } from "@interfaces/objects/errors";

export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<IBrowserNode, VectorError | Error> | null;
  protected browserNode: IBrowserNode | null;
  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {
    this.browserNodeResult = null;
    this.browserNode = null;
  }
  protected initialize(): ResultAsync<IBrowserNode, VectorError | Error> {
    if (this.browserNodeResult == null) {
      this.browserNodeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          const vectorBrowserNode = new BrowserNode({
            logger: this.logUtils.getPino(),
            iframeSrc: config.iframeSource,
            chainProviders: config.chainProviders,
          });

          this.browserNode = new WrappedBrowserNode(vectorBrowserNode);

          return this.browserNode.init();
        })
        .map(() => {
          return this.browserNode as IBrowserNode;
        });
    }
    return this.browserNodeResult;
  }
  public getBrowserNode(): ResultAsync<IBrowserNode, VectorError | Error> {
    return this.initialize();
  }
}
