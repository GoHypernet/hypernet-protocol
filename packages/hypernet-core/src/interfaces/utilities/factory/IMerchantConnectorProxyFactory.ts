import { MerchantConnectorError } from "@hypernetlabs/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorProxyFactory {
  factoryProxy(merchantUrl: string): ResultAsync<IMerchantConnectorProxy, MerchantConnectorError>;
  destroyMerchantConnectorProxy(merchantUrl: string): void;
}
