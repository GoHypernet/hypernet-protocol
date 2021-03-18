import { IMerchantService } from "@interfaces/business";
import { ResultAsync } from "neverthrow";
import {
  CoreUninitializedError,
  MerchantConnectorError,
  MerchantValidationError,
  PersistenceError,
} from "@hypernetlabs/objects/errors";
import { IMerchantConnectorRepository } from "@interfaces/data";
import { IContextProvider } from "@interfaces/utilities";
import { ResultUtils } from "@hypernetlabs/utils";

export class MerchantService implements IMerchantService {
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected contextProvider: IContextProvider,
  ) {}

  public authorizeMerchant(
    merchantUrl: string,
  ): ResultAsync<void, CoreUninitializedError | MerchantValidationError | PersistenceError> {
    return ResultUtils.combine([this.contextProvider.getContext(), this.getAuthorizedMerchants()]).map(async (vals) => {
      const [context, authorizedMerchantsMap] = vals;

      // Remove the merchant iframe proxy related to that merchantUrl if there is any activated ones.
      if (authorizedMerchantsMap.get(merchantUrl)) {
        this.merchantConnectorRepository.removeAuthorizedMerchant(merchantUrl);
      }

      this.merchantConnectorRepository.addAuthorizedMerchant(merchantUrl).map(() => {
        context.onMerchantAuthorized.next(merchantUrl);
      });
    });
  }

  public getAuthorizedMerchants(): ResultAsync<Map<string, string>, PersistenceError> {
    return this.merchantConnectorRepository.getAuthorizedMerchants();
  }

  public activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | PersistenceError> {
    return this.merchantConnectorRepository.activateAuthorizedMerchants();
  }

  public merchantIFrameClosed(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.merchantIFrameClosed(merchantUrl);
  }
  
  public merchantIFrameDisplayed(merchantUrl: string): ResultAsync<void, MerchantConnectorError> {
    return this.merchantConnectorRepository.merchantIFrameDisplayed(merchantUrl);
  }
}
