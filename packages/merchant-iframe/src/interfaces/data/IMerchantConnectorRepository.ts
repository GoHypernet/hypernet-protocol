import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: string): ResultAsync<string, Error>;
  getMerchantSignature(merchantUrl: string): ResultAsync<string, Error>;
  getMerchantAddress(merchantUrl: string): ResultAsync<string, Error>;
}
