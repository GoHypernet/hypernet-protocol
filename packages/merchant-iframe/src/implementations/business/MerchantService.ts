import { errAsync, okAsync, ResultAsync } from "neverthrow";
import {ResultUtils} from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IMerchantConnector } from "@hypernetlabs/merchant-connector";

export class MerchantService implements IMerchantService {
  constructor(protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected contextProvider: IContextProvider) {}

  public activateMerchantConnector(): ResultAsync<IMerchantConnector, MerchantConnectorError | MerchantValidationError> {
    const context = this.contextProvider.getMerchantContext();

    // If we don't have validated code, that's a problem.
    if (context.validatedMerchantCode == null) {
      return errAsync(new MerchantValidationError("Cannot activate merchant connector, no validated code available!"));
    }

    // Now we eval the connector code, which is supposed to return an IMerchantConnector
    const merchantConnector = eval(context.validatedMerchantCode) as IMerchantConnector;

    if (merchantConnector == null) {
      return errAsync(new MerchantConnectorError("Validated code does not evaluate to an object"));
    }

    context.merchantConnector = merchantConnector;
    this.contextProvider.setMerchantContext(context);
    context.onMerchantConnectorActivated.next(merchantConnector);

    return okAsync(merchantConnector);
  }

  public validateMerchantConnector(): ResultAsync<string, MerchantValidationError> {
    // This is going to connect to the merchantUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at merchantUrl/publicKey
    // The code will be cached in local storage but the signing key will be
    const context = this.contextProvider.getMerchantContext();

    return ResultUtils.combine([
      this.merchantConnectorRepository.getMerchantCode(context.merchantUrl),
      this.merchantConnectorRepository.getMerchantSignature(context.merchantUrl),
      this.merchantConnectorRepository.getMerchantPublicKey(context.merchantUrl),
    ]).andThen((vals) => {
      const [merchantCode, signature, publicKey] = vals;

      const calculatedAddress = ethers.utils.verifyMessage(merchantCode, signature);
      const address = ethers.utils.computeAddress(publicKey);

      if (calculatedAddress !== address) {
        return errAsync(new MerchantValidationError("Merchant code does not match signature!"));
      }

      // Merchant's code passes muster. Store the merchant code in the context as validated.
      const context = this.contextProvider.getMerchantContext();
      context.validatedMerchantCode = merchantCode;
      context.validatedMerchantSignature = signature;
      this.contextProvider.setMerchantContext(context);

      // Return the valid signature
      return okAsync(signature);
    });
  }
}
