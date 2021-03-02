import { IConfigProvider, IContextProvider, IMerchantConnectorProxy } from "@interfaces/utilities";
import { ResultAsync, HypernetContext, HypernetConfig } from "@interfaces/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { MerchantConnectorProxy } from "@implementations/utilities/MerchantConnectorProxy";
import { MerchantConnectorError } from "@interfaces/objects/errors";

export class MerchantConnectorProxyFactory implements IMerchantConnectorProxyFactory {
  constructor(protected configProvider: IConfigProvider, protected contextProvider: IContextProvider) {}

  factoryProxy(merchantUrl: string): ResultAsync<IMerchantConnectorProxy, MerchantConnectorError> {
    let proxy: IMerchantConnectorProxy;
    let config: HypernetConfig;
    let context: HypernetContext;

    return ResultUtils.combine([this.configProvider.getConfig(), this.contextProvider.getContext()])
      .andThen((vals) => {
        [config, context] = vals;

        const iframeUrl = new URL(config.merchantIframeUrl);
        iframeUrl.searchParams.set("merchantUrl", merchantUrl);
        proxy = new MerchantConnectorProxy(null, iframeUrl.toString(), context);

        // The proxy needs to be activated to do anything. NOTE: this is different
        // from activating the connector itself; this just activates the proxy
        // for communication. In the case of the merchant connector, it will grab
        // the necessary data from the merchant URL in order to validate that the
        // connector code is properly signed and valid.
        return proxy.activate();
      })
      .map((child) => {
        // We need to make sure to have the listeners after postmate model gets activated
        child.on("onDisplayRequested", () => {
          context.onMerchantIFrameDisplayRequested.next();
        });

        child.on("onCloseRequested", () => {
          console.log("onCloseRequested: ");
          context.onMerchantIFrameCloseRequested.next();
        });

        return proxy;
      });
  }
}
