import { BrowserNode } from "@connext/vector-browser-node";
import { IBrowserNode, IConfigProvider } from "@interfaces/utilities";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";
import { WrappedBrowserNode } from "@implementations/utilities";
import { ResultAsync } from "neverthrow";
import { ILogUtils } from "@hypernetlabs/utils";

export class BrowserNodeFactory implements IBrowserNodeFactory {
  constructor(protected configProvider: IConfigProvider, protected logUtils: ILogUtils) {}

  public factoryBrowserNode(): ResultAsync<IBrowserNode, never> {
    return this.configProvider.getConfig().map((config) => {
      // Create the browser node
      const vectorBrowserNode = new BrowserNode({
        routerPublicIdentifier: config.routerPublicIdentifier,
        logger: this.logUtils.getPino(),
        iframeSrc: config.iframeSource,
        chainProviders: config.chainProviders,
        chainAddresses: config.chainAddresses,
        //messagingUrl: 'localhost:80'
      });

      // Stick it in a wrapper
      return new WrappedBrowserNode(vectorBrowserNode);
    });
  }
}
