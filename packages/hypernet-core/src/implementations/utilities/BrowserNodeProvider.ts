import { IBrowserNodeProvider } from "@interfaces/utilities/IBrowserNodeProvider";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BrowserNode } from "@connext/vector-browser-node";
import { IContextProvider, ILogUtils } from "@interfaces/utilities";
import { NodeError } from "@connext/vector-types";
import { ResultAsync } from "neverthrow";
export class BrowserNodeProvider implements IBrowserNodeProvider {
  protected browserNodeResult: ResultAsync<BrowserNode, NodeError | Error> | null;
  protected browserNode: BrowserNode | null;
  constructor(
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {
    this.browserNodeResult = null;
    this.browserNode = null;
  }
  protected initialize(): ResultAsync<BrowserNode, NodeError | Error> {
    if (this.browserNodeResult == null) {
      this.browserNodeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          this.browserNode = new BrowserNode({
            logger: this.logUtils.getPino(),
            iframeSrc: config.iframeSource,
            chainProviders: config.chainProviders,
          });
          return ResultAsync.fromPromise(this.browserNode.init(), (e) => {
            return e as NodeError;
          });
        })
        .map(() => {
          return this.browserNode as BrowserNode;
        });
    }
    return this.browserNodeResult;
  }
  public getBrowserNode(): ResultAsync<BrowserNode, NodeError | Error> {
    return this.initialize();
  }
}
