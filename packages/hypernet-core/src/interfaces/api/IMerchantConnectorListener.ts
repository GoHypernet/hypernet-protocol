import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorListener {
  setup(): ResultAsync<void, never>;
}
