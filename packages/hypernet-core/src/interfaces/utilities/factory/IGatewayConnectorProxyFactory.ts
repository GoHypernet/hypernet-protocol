import { ProxyError, GatewayRegistrationInfo } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IGatewayConnectorProxy } from "@interfaces/utilities";

export interface IGatewayConnectorProxyFactory {
  factoryProxy(
    gatewayRegistrationInfo: GatewayRegistrationInfo,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError>;
}

export const IGatewayConnectorProxyFactoryType = Symbol.for(
  "IGatewayConnectorProxyFactory",
);
