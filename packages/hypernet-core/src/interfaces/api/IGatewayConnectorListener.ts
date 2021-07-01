import { ResultAsync } from "neverthrow";

export interface IGatewayConnectorListener {
  setup(): ResultAsync<void, never>;
}
