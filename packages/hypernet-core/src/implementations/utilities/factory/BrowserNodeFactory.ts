import { BrowserNode } from "@connext/vector-browser-node";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { WrappedBrowserNode } from "@implementations/utilities";
import { IBrowserNode, IConfigProvider } from "@interfaces/utilities";
import { IBrowserNodeFactory } from "@interfaces/utilities/factory";

export class BrowserNodeFactory implements IBrowserNodeFactory {
  constructor(
    protected configProvider: IConfigProvider,
    protected logUtils: ILogUtils,
  ) {}

  public factoryBrowserNode(): ResultAsync<IBrowserNode, never> {
    return this.configProvider.getConfig().map((config) => {
      // Create the browser node
      const vectorBrowserNode = new BrowserNode({
        routerPublicIdentifier: config.routerPublicIdentifier,
        logger: this.logUtils.getPino(),
        iframeSrc: config.iframeSource,
        chainProviders: config.chainProviders,
        chainAddresses: config.chainAddresses,
        natsUrl: config.natsUrl,
        authUrl: config.authUrl,
        //messagingUrl: 'localhost:80'
      });

      // Stick it in a wrapper
      return new WrappedBrowserNode(vectorBrowserNode);
    });
  }
}
