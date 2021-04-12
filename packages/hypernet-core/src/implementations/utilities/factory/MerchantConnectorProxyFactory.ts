import { IConfigProvider, IMerchantConnectorProxy, IContextProvider } from "@interfaces/utilities";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { MerchantConnectorProxy } from "@implementations/utilities/MerchantConnectorProxy";
import { ok, Result, ResultAsync } from "neverthrow";
import { MerchantUrl } from "@hypernetlabs/objects";
import { LogicalError, MerchantValidationError, ProxyError } from "@hypernetlabs/objects";

export class MerchantConnectorProxyFactory implements IMerchantConnectorProxyFactory {
  protected static proxyMap: Map<MerchantUrl, IMerchantConnectorProxy> = new Map();

  constructor(protected configProvider: IConfigProvider, protected contextProvider: IContextProvider) {}

  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<IMerchantConnectorProxy, MerchantValidationError | LogicalError | ProxyError> {
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
        return proxy.activate();
      })
      .map(() => {
        MerchantConnectorProxyFactory.proxyMap.set(merchantUrl, proxy);
        return proxy;
      });
  }

  destroyMerchantConnectorProxy(merchantUrl: MerchantUrl): Result<void, never> {
    const proxy = MerchantConnectorProxyFactory.proxyMap.get(merchantUrl);
    proxy?.destroy();
    MerchantConnectorProxyFactory.proxyMap.delete(merchantUrl);
    return ok(undefined);
  }

  private _prepareIFrameContainer(): HTMLElement {
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
