import { GatewayUrl, AjaxError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorRepository {
  getGatewayCode(gatewayUrl: GatewayUrl): ResultAsync<string, AjaxError>;
}

export const IGatewayConnectorRepositoryType = Symbol.for(
  "IGatewayConnectorRepository",
);
