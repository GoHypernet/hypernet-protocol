import { MerchantValidationError, LogicalError, ProxyError } from "@hypernetlabs/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    merchantUrl: string,
  ): ResultAsync<IMerchantConnectorProxy, MerchantValidationError | LogicalError | ProxyError>;
  destroyMerchantConnectorProxy(merchantUrl: string): void;
}
