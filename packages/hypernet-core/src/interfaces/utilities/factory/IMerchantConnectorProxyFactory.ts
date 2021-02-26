import { MerchantConnectorError } from "@interfaces/objects/errors";
import { IMerchantConnectorProxy } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(merchantUrl: string): ResultAsync<IMerchantConnectorProxy, MerchantConnectorError>;
}