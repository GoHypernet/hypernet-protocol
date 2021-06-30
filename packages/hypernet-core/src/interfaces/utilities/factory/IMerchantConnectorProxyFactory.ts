import { ProxyError, GatewayUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorProxy } from "@interfaces/utilities";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<IMerchantConnectorProxy, ProxyError>;
}

export const IMerchantConnectorProxyFactoryType = Symbol.for(
  "IMerchantConnectorProxyFactory",
);
