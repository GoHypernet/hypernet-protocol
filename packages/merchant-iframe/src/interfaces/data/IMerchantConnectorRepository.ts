import { ResultAsync } from "neverthrow";
import { PublicKey } from "@hypernetlabs/hypernet-core";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: URL): ResultAsync<string, Error>;
  getMerchantSignature(merchantUrl: URL): ResultAsync<string, Error>;
  getMerchantAddress(merchantUrl: URL): ResultAsync<string, Error>;
}
