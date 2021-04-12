import { MerchantValidationError, LogicalError, ProxyError } from "@hypernetlabs/objects";
import { MerchantUrl } from "@hypernetlabs/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";
import { Result, ResultAsync } from "neverthrow";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<IMerchantConnectorProxy, MerchantValidationError | LogicalError | ProxyError>;
  destroyMerchantConnectorProxy(merchantUrl: MerchantUrl): Result<void, never>;
}
