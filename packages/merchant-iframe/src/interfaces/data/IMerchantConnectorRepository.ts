import {
  Signature,
  EthereumAddress,
  GatewayUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: GatewayUrl): ResultAsync<string, AjaxError>;
  getMerchantSignature(
    merchantUrl: GatewayUrl,
  ): ResultAsync<Signature, AjaxError>;
  getMerchantAddress(
    merchantUrl: GatewayUrl,
  ): ResultAsync<EthereumAddress, AjaxError>;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
