import { ProxyError, MerchantUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorProxy } from "@interfaces/utilities";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<IMerchantConnectorProxy, ProxyError>;
}
