import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorListener {
  initialize(): ResultAsync<void, Error>;
}
