import {
  Signature,
  EthereumAddress,
  GatewayUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  getMerchantCode(gatewayUrl: GatewayUrl): ResultAsync<string, AjaxError>;
  getMerchantSignature(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<Signature, AjaxError>;
  getMerchantAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<EthereumAddress, AjaxError>;
}

export const IMerchantConnectorRepositoryType = Symbol.for(
  "IMerchantConnectorRepository",
);
