import { ResultAsync } from "neverthrow";
import { Payment, PublicKey } from "@interfaces/objects";
import { PersistenceError } from "@interfaces/objects/errors/PersistenceError";
import { CoreUninitializedError, MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";

export interface IMerchantConnectorRepository {
  /**
   * Returns the PublicKey for a merchant
   */
  getMerchantPublicKeys(merchantUrl: string[]): ResultAsync<Map<string, PublicKey>, Error>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(merchantUrl: string): ResultAsync<void, PersistenceError>;

  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;

  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(
    merchantUrl: string,
    paymentId: string,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError>;
}
