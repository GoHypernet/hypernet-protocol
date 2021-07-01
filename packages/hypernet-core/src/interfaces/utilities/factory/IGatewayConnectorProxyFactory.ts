import { ProxyError, GatewayUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IGatewayConnectorProxy } from "@interfaces/utilities";

export interface IGatewayConnectorProxyFactory {
  factoryProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError>;
}

export const IGatewayConnectorProxyFactoryType = Symbol.for(
  "IGatewayConnectorProxyFactory",
);
