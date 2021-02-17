import { ResultUtils } from "@hypernetlabs/utils";
import { IMerchantService } from "@interfaces/business";
import { PublicKey, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, MerchantValidationError, PersistenceError } from "@interfaces/objects/errors";
import { ethers } from "ethers";
// import crypto from "crypto";
import { errAsync, okAsync } from "neverthrow";
import { IMerchantConnectorRepository } from "@interfaces/data";

export class MerchantService implements IMerchantService {
  constructor(protected merchantConnectorRepository: IMerchantConnectorRepository) {}

  public addAuthorizedMerchant(
    merchantUrl: URL,
  ): ResultAsync<void, CoreUninitializedError | MerchantValidationError | PersistenceError> {
    return this.merchantConnectorRepository.getMerchantConnectorSignature(merchantUrl)
    .andThen((signature) => {
    return this.merchantConnectorRepository.addAuthorizedMerchant(merchantUrl, signature);
    });
  }
}
