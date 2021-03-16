import { ResultAsync } from "neverthrow";
import { PersistenceError } from "@interfaces/objects/errors/PersistenceError";
import { CoreUninitializedError, MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";

export interface IMerchantConnectorRepository {
  /**
   * Returns a map of merchant URLs to their address
   */
  getMerchantAddresses(merchantUrl: string[]): ResultAsync<Map<string, string>, Error>;

  /**
   * Adds the merchant url as authorized with a particular signature
   * @param merchantUrl
   * @param signature
   */
  addAuthorizedMerchant(merchantUrl: string): ResultAsync<void, PersistenceError>;

  /**
   * Destroy merchant connector proxy
   * @param merchantUrl
   */
  removeAuthorizedMerchant(merchantUrl: string): void;

  getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError>;

  activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(
    merchantUrl: string,
    paymentId: string,
    transferId: string,
  ): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError>;
}
