import { MerchantUrl, ProxyError } from "@hypernetlabs/objects";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { MerchantConnectorProxy } from "@implementations/utilities/MerchantConnectorProxy";
import {
  IConfigProvider,
  IMerchantConnectorProxy,
  IContextProvider,
  IConfigProviderType,
  IContextProviderType,
} from "@interfaces/utilities";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";

@injectable()
export class MerchantConnectorProxyFactory
  implements IMerchantConnectorProxyFactory {
  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<IMerchantConnectorProxy, ProxyError> {
    let proxy: IMerchantConnectorProxy;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const iframeUrl = new URL(config.merchantIframeUrl);
        iframeUrl.searchParams.set("merchantUrl", merchantUrl);

        proxy = new MerchantConnectorProxy(
          this._prepareIFrameContainer(),
          iframeUrl.toString(),
          merchantUrl,
          `hypernet-core-merchant-connector-iframe-${merchantUrl}`,
          this.contextProvider,
          config.debug,
        );

        // The proxy needs to be activated to do anything. NOTE: this is different
        // from activating the connector itself; this just activates the proxy
        // for communication. In the case of the merchant connector, it will grab
        // the necessary data from the merchant URL in order to validate that the
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
