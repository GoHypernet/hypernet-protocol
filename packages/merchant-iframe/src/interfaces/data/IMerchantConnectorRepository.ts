import { ResultAsync } from "neverthrow";
import { Signature, EthereumAddress } from "@hypernetlabs/objects";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: string): ResultAsync<string, Error>;
  getMerchantSignature(merchantUrl: string): ResultAsync<Signature, Error>;
  getMerchantAddress(merchantUrl: string): ResultAsync<EthereumAddress, Error>;
}
