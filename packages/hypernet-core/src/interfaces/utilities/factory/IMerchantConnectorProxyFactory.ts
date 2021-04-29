import { ProxyError, MerchantUrl } from "@hypernetlabs/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<IMerchantConnectorProxy, ProxyError>;
}
