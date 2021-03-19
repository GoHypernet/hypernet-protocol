import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";

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

  closeMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
  displayMerchantIFrame(merchantUrl: string): ResultAsync<void, MerchantConnectorError>;
}
