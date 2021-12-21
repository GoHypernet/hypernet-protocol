import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorListener {
  initialize(): ResultAsync<void, never>;
}

export const IGatewayConnectorListenerType = Symbol.for(
  "IGatewayConnectorListener",
);
