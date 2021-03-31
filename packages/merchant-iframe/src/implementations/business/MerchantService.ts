import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IMerchantConnectorRepository, IPersistenceRepository } from "@merchant-iframe/interfaces/data";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IMerchantConnector, IRedirectInfo } from "@hypernetlabs/merchant-connector";
import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";

declare global {
  interface Window {
    connector: IMerchantConnector;
  }
}

export class MerchantService implements IMerchantService {
  constructor(
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    protected persistenceRepository: IPersistenceRepository,
    protected contextProvider: IContextProvider,
  ) {}
  private static merchantUrlCacheBusterUsed: boolean = false;

  public activateMerchantConnector(): ResultAsync<
    IMerchantConnector,
    MerchantConnectorError | MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();
    console.log(`Activating merchant connector for ${context.merchantUrl}`);
    // If we don't have validated code, that's a problem.
    if (context.validatedMerchantCode == null || context.validatedMerchantSignature == null) {
      return errAsync(new MerchantValidationError("Cannot activate merchant connector, no validated code available!"));
    }

    // We will now run the connector code. It needs to put an IMerchantConnector object in the window.connector
    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(context.validatedMerchantCode);
    newScript.appendChild(inlineScript);
    document.head.appendChild(newScript);

    const merchantConnector = window.connector;

    if (merchantConnector == null) {
      return errAsync(new MerchantConnectorError("Validated code does not evaluate to an object"));
    }

    // Store the merchant connector object and notify the world
    context.merchantConnector = merchantConnector;
    this.contextProvider.setMerchantContext(context);
    context.onMerchantConnectorActivated.next(merchantConnector);

    // Once a connector has been activated once during the session, we can
    // reactivate it automatically on startup.
    this.persistenceRepository.addActivatedMerchantSignature(context.validatedMerchantSignature);

    return okAsync(merchantConnector);
  }

  public validateMerchantConnector(): ResultAsync<string, MerchantValidationError> {
    // This is going to connect to the merchantUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at merchantUrl/publicKey
    // The code will be cached in local storage but the signing key will be
    const context = this.contextProvider.getMerchantContext();
    let signature: string = "";
    let address: string = "";
    let merchantCode: string = "";

    // If there is no merchant URL set, it's not an error
    if (context.merchantUrl == "") {
      return okAsync("");
    }

    return ResultUtils.combine([
      this.merchantConnectorRepository.getMerchantCode(context.merchantUrl),
      this.merchantConnectorRepository.getMerchantSignature(context.merchantUrl),
      this.merchantConnectorRepository.getMerchantAddress(context.merchantUrl),
    ])
      .andThen((vals) => {
        [merchantCode, signature, address] = vals;

        const calculatedAddress = ethers.utils.verifyMessage(merchantCode, signature);

        if (calculatedAddress !== address) {
          return errAsync<string, MerchantValidationError>(
            new MerchantValidationError("Merchant code does not match signature!"),
          );
        }

        // Merchant's code passes muster. Store the merchant code in the context as validated.
        const context = this.contextProvider.getMerchantContext();
        console.log(`Merchant connector for ${context.merchantUrl} validated!`);
        context.validatedMerchantCode = merchantCode;
        context.validatedMerchantSignature = signature;
        this.contextProvider.setMerchantContext(context);

        // Return the valid signature
        return okAsync(signature);
      })
      .orElse((e) => {
        const err = e as MerchantValidationError;
        if (!MerchantService.merchantUrlCacheBusterUsed) {
          MerchantService.merchantUrlCacheBusterUsed = true;
          return this._validateMerchantConnectorCodeWithCasheBuster(signature, address);
        } else {
          return errAsync(err);
        }
      });
  }

  private _validateMerchantConnectorCodeWithCasheBuster(
    signature: string,
    address: string,
  ): ResultAsync<string, MerchantValidationError> {
    const context = this.contextProvider.getMerchantContext();

    // If there is no merchant URL set, it's not an error
    if (context.merchantUrl == "") {
      return okAsync("");
    }

    const cacheBuster: string = `?v=${new Date().getTime()}`;
    return this.merchantConnectorRepository
      .getMerchantCode(context.merchantUrl + cacheBuster)
      .andThen((merchantCode) => {
        const calculatedAddress = ethers.utils.verifyMessage(merchantCode, signature);

        if (calculatedAddress !== address) {
          return errAsync<string, MerchantValidationError>(
            new MerchantValidationError("Merchant code does not match signature!"),
          );
        }

        // Merchant's code passes muster. Store the merchant code in the context as validated.
        const context = this.contextProvider.getMerchantContext();
        console.log(`Merchant connector for ${context.merchantUrl} validated!`);
        context.validatedMerchantCode = merchantCode;
        context.validatedMerchantSignature = signature;
        this.contextProvider.setMerchantContext(context);

        // Return the valid signature
        return okAsync(signature);
      });
  }

  public prepareForRedirect(redirectInfo: IRedirectInfo): ResultAsync<void, Error> {
    const context = this.contextProvider.getMerchantContext();

    // Register the redirect
    this.persistenceRepository.setExpectedRedirect(
      new ExpectedRedirect(context.merchantUrl, redirectInfo.redirectParam, redirectInfo.redirectValue),
    );

    // Let the connector know it can move forward
    redirectInfo.readyFunction();

    // Return
    return okAsync(undefined);
  }

  public autoActivateMerchantConnector(): ResultAsync<
    IMerchantConnector | null,
    MerchantConnectorError | MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();

    // We can auto-activate the merchant connector if the connector
    // had been previously activated in this session.
    const activatedMerchants = this.persistenceRepository.getActivatedMerchantSignatures();

    if (context.validatedMerchantSignature != null && activatedMerchants.includes(context.validatedMerchantSignature)) {
      return this.activateMerchantConnector();
    }

    return okAsync(null);
  }

  public getMerchantUrl(): ResultAsync<string, MerchantValidationError> {
    // First, see if this is going to be easy. Normally a merchantUrl
    // is provided as a param.
    const urlParams = new URLSearchParams(window.location.search);
    let merchantUrl = urlParams.get("merchantUrl");

    if (merchantUrl != null) {
      return okAsync(merchantUrl);
    }

    // Can't do it the easy way; there is an alternative. If this is
    // a redirect, and we have a registered redirect, we can use that
    // connector.
    if (document.referrer != "") {
      // This is is from a redirect.
      // Check if there is an expected redirect registered.
      const expectedRedirect = this.persistenceRepository.getExpectedRedirect();

      if (expectedRedirect != null) {
        // Check the redirect params
        const urlParams = new URLSearchParams(window.location.search);
        let paramValue = urlParams.get(expectedRedirect.redirectParam);

        if (paramValue == expectedRedirect.paramValue) {
          return okAsync(expectedRedirect.merchantUrl);
        }
      }
    }
    return errAsync(new MerchantValidationError("merchantUrl can not be determined!"));
  }
}
