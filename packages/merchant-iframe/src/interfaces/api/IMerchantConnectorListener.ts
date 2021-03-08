import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorListener {
    initialize(): ResultAsync<void, Error>;
}