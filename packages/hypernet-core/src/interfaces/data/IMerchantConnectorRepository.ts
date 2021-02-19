import { ResultAsync } from "neverthrow";
import { Payment, PublicKey } from "@interfaces/objects";
import { PersistenceError } from "@interfaces/objects/errors/PersistenceError";
import { CoreUninitializedError, MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";

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
  addAuthorizedMerchant(merchantUrl: URL): ResultAsync<void, PersistenceError>;

  getAuthorizedMerchants(): ResultAsync<Map<URL, string>, PersistenceError>;

  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(
    merchantUrl: URL,
    paymentId: string,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError>;
}
