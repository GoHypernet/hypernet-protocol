import {
  Signature,
  EthereumAddress,
  MerchantUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: MerchantUrl): ResultAsync<string, AjaxError>;
  getMerchantSignature(
    merchantUrl: MerchantUrl,
  ): ResultAsync<Signature, AjaxError>;
  getMerchantAddress(
    merchantUrl: MerchantUrl,
  ): ResultAsync<EthereumAddress, AjaxError>;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
