import {
  MerchantValidationError,
  LogicalError,
  ProxyError,
} from "@hypernetlabs/objects";
import { MerchantUrl } from "@hypernetlabs/objects";
import { Result, ResultAsync } from "neverthrow";

import { IMerchantConnectorProxy } from "@interfaces/utilities";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(
    merchantUrl: MerchantUrl,
  ): ResultAsync<
    IMerchantConnectorProxy,
    MerchantValidationError | LogicalError | ProxyError
  >;
  destroyMerchantConnectorProxy(merchantUrl: MerchantUrl): Result<void, never>;
}
