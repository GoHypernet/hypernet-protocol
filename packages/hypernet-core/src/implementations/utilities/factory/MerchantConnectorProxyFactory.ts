import { IConfigProvider, IMerchantConnectorProxy, IContextProvider } from "@interfaces/utilities";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { MerchantConnectorProxy } from "@implementations/utilities/MerchantConnectorProxy";
import { ResultAsync } from "neverthrow";
import { MerchantConnectorError } from "@interfaces/objects/errors";

export class MerchantConnectorProxyFactory implements IMerchantConnectorProxyFactory {
  constructor(protected configProvider: IConfigProvider, protected contextProvider: IContextProvider) {}

  factoryProxy(merchantUrl: string): ResultAsync<IMerchantConnectorProxy, MerchantConnectorError> {
    let proxy: IMerchantConnectorProxy;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const iframeUrl = new URL(config.merchantIframeUrl);
        iframeUrl.searchParams.set("merchantUrl", merchantUrl);
        proxy = new MerchantConnectorProxy(null, iframeUrl.toString(), this.contextProvider);

        // The proxy needs to be activated to do anything. NOTE: this is different
        // from activating the connector itself; this just activates the proxy
        // for communication. In the case of the merchant connector, it will grab
        // the necessary data from the merchant URL in order to validate that the
        // connector code is properly signed and valid.
        return proxy.activateProxy();
      })
      .map(() => {
        return proxy;
      });
  }
}
