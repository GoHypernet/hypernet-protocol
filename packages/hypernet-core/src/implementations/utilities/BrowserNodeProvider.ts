import { BrowserNode } from "@connext/vector-browser-node";
import {
  IBrowserNode,
  IContextProvider,
  ILogUtils,
  IBrowserNodeProvider,
  IConfigProvider,
} from "@interfaces/utilities";
import { WrappedBrowserNode } from "./WrappedBrowserNode";
import { VectorError } from "@interfaces/objects/errors";
import { ResultAsync } from "@interfaces/objects";

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
  protected initialize(): ResultAsync<IBrowserNode, VectorError> {
    if (this.browserNodeResult == null) {
      this.browserNodeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          const vectorBrowserNode = new BrowserNode({
            logger: this.logUtils.getPino(),
            iframeSrc: config.iframeSource,
            chainProviders: config.chainProviders,
            chainAddresses: config.chainAddresses,
            //messagingUrl: 'localhost:80'
          });

          this.browserNode = new WrappedBrowserNode(vectorBrowserNode);

          return this.browserNode.init();
        })
        .map(() => {
          return this.browserNode as IBrowserNode;
        });
    }
    return this.browserNodeResult as ResultAsync<IBrowserNode, VectorError>;
  }
  public getBrowserNode(): ResultAsync<IBrowserNode, VectorError | Error> {
    return this.initialize();
  }
}
