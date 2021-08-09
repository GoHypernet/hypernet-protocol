import { BrowserNode } from "@connext/vector-browser-node";
import { ContractAddresses } from "@connext/vector-types";
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
      this.logUtils.debug("Creating BrowserNode");
      // Create the browser node
      const vectorBrowserNode = new BrowserNode({
        logger: this.logUtils.getPino(),
        iframeSrc: config.iframeSource,
        chainProviders: config.chainProviders,
        chainAddresses: config.chainAddresses as ContractAddresses,
        natsUrl: config.natsUrl,
        authUrl: config.authUrl,
        //messagingUrl: 'localhost:80'
      });

      // Stick it in a wrapper
      return new WrappedBrowserNode(vectorBrowserNode);
    });
  }
}
