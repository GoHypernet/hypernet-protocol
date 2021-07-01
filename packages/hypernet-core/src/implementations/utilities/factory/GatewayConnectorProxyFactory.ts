import { GatewayUrl, ProxyError } from "@hypernetlabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { GatewayConnectorProxy } from "@implementations/utilities/GatewayConnectorProxy";
import {
  IConfigProvider,
  IGatewayConnectorProxy,
  IContextProvider,
  IConfigProviderType,
  IContextProviderType,
} from "@interfaces/utilities";
import { IGatewayConnectorProxyFactory } from "@interfaces/utilities/factory";

@injectable()
export class GatewayConnectorProxyFactory
  implements IGatewayConnectorProxyFactory
{
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  factoryProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError> {
    let proxy: IGatewayConnectorProxy;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const iframeUrl = new URL(config.gatewayIframeUrl);
        iframeUrl.searchParams.set("gatewayUrl", gatewayUrl);

        proxy = new GatewayConnectorProxy(
          this._prepareIFrameContainer(),
          iframeUrl.toString(),
          gatewayUrl,
          `hypernet-core-gateway-connector-iframe-${gatewayUrl}`,
          this.contextProvider,
          config.debug,
        );

        // The proxy needs to be activated to do anything. NOTE: this is different
        // from activating the connector itself; this just activates the proxy
        // for communication. In the case of the gateway connector, it will grab
        // the necessary data from the gateway URL in order to validate that the
        // connector code is properly signed and valid.
        return proxy.activateProxy();
      })
      .map(() => {
        // Return the activated proxy
        return proxy;
      })
      .mapErr((e) => {
        //
        return e;
      });
  }

  protected _prepareIFrameContainer(): HTMLElement {
    // We want the body to be the container here.
    const element = document.body;
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
          iframe {
            display: none;
            border: none;
            width: 100%;
            height: 100%;
          }
          html {
            overflow-y: hidden;
            height: 100%;
          }
          body {
            height: 100%;
          }
        `),
    );
    document.head.appendChild(style);

    return element;
  }
}
