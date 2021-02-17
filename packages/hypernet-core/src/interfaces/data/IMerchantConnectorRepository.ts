import { ResultAsync } from "neverthrow";
import { PublicKey } from "@interfaces/objects";
import { PersistenceError } from "@interfaces/objects/errors/PersistenceError";

export interface IMerchantConnectorRepository {
  /**
   * Returns the verified signature from the merchant iframe; IE, the signature of the code actually running for the merchantURL
   */
  getMerchantConnectorSignature(merchantUrl: URL): ResultAsync<string, Error>;

  /**
   * Returns the PublicKey for a merchant
   */
  getMerchantPublicKey(merchantUrl: URL): ResultAsync<PublicKey, Error>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(merchantUrl: URL, signature: string): ResultAsync<void, PersistenceError>;
}
