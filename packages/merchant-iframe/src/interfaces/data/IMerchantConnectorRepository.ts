import { ResultAsync } from "neverthrow";
import { Signature, EthereumAddress, MerchantUrl, AjaxError } from "@hypernetlabs/objects";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: MerchantUrl): ResultAsync<string, AjaxError>;
  getMerchantSignature(merchantUrl: MerchantUrl): ResultAsync<Signature, AjaxError>;
  getMerchantAddress(merchantUrl: MerchantUrl): ResultAsync<EthereumAddress, AjaxError>;
}
