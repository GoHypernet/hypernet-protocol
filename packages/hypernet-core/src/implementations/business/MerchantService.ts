import { IMerchantService } from "@interfaces/business";
import { ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, MerchantValidationError, PersistenceError } from "@interfaces/objects/errors";
import { IMerchantConnectorRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";

export class MerchantService implements IMerchantService {
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected contextProvider: IContextProvider,
  ) {}

  public authorizeMerchant(
    merchantUrl: URL,
  ): ResultAsync<void, CoreUninitializedError | MerchantValidationError | PersistenceError> {
    return this.merchantConnectorRepository
      .getMerchantConnectorSignature(merchantUrl)
      .andThen((signature) => {
        return this.merchantConnectorRepository.addAuthorizedMerchant(merchantUrl, signature);
      })
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.onMerchantAuthorized.next(merchantUrl);
      });
  }

  public getAuthorizedMerchants(): ResultAsync<URL[], PersistenceError> {
    return this.merchantConnectorRepository.getAuthorizedMerchants();
  }
}
