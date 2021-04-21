import { Signature, EthereumAddress, MerchantUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMerchantConnectorRepository {
  getMerchantCode(merchantUrl: MerchantUrl): ResultAsync<string, Error>;
  getMerchantSignature(merchantUrl: MerchantUrl): ResultAsync<Signature, Error>;
  getMerchantAddress(merchantUrl: MerchantUrl): ResultAsync<EthereumAddress, Error>;
}
