import {
  Signature,
  EthereumAddress,
  GatewayUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorRepository {
  getGatewayCode(gatewayUrl: GatewayUrl): ResultAsync<string, AjaxError>;
  getGatewaySignature(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<Signature, AjaxError>;
  getGatewayAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<EthereumAddress, AjaxError>;
}

export const IGatewayConnectorRepositoryType = Symbol.for(
  "IGatewayConnectorRepository",
);
