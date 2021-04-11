import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { IMerchantConnectorRepository, IPersistenceRepository } from "@merchant-iframe/interfaces/data";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IMerchantConnector, IRedirectInfo, IResolutionResult } from "@hypernetlabs/merchant-connector";
import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";
import { LogicalError, PublicIdentifier, Balances, EthereumAddress, Signature, PaymentId } from "@hypernetlabs/objects";

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

  public activateMerchantConnector(publicIdentifier: PublicIdentifier, balances: Balances): ResultAsync<
    IMerchantConnector,
    MerchantConnectorError | MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();
    console.log(`Activating merchant connector for ${context.merchantUrl}`);
    // If we don't have validated code, that's a problem.
    if (context.validatedMerchantCode == null || context.validatedMerchantSignature == null) {
      return errAsync(new MerchantValidationError("Cannot activate merchant connector, no validated code available!"));
    }

    if (publicIdentifier == null) {
      return errAsync(new LogicalError("Cannot activate merchant connector, public identifier is unknown!"));
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

    console.log(`CHARLIE, publicIdentifier=${publicIdentifier}, balances=${balances}`);
    console.log(balances)

    // Send some initial information to the merchant connector
    merchantConnector.onPublicIdentifierReceived(publicIdentifier);

    merchantConnector.onBalancesReceived(balances);

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
    let signature = Signature("");
    let address = EthereumAddress("");

    // If there is no merchant URL set, it's not an error
    if (context.merchantUrl == "") {
      return okAsync("");
    }

    return ResultUtils.combine([
      this.merchantConnectorRepository.getMerchantSignature(context.merchantUrl),
      this.merchantConnectorRepository.getMerchantAddress(context.merchantUrl),
    ])
      .andThen((vals) => {
        [signature, address] = vals;

        return this._validateMerchantConnectorCode(context.merchantUrl, signature, address);
      })
      .orElse((e) => {
        const err = e as MerchantValidationError;
        if (!MerchantService.merchantUrlCacheBusterUsed) {
          MerchantService.merchantUrlCacheBusterUsed = true;
          return this._validateMerchantConnectorCode(context.merchantUrl, signature, address, true);
        } else {
          return errAsync(err);
        }
      });
  }

  private _validateMerchantConnectorCode(
    merchantUrl: string,
    signature: Signature,
    address: EthereumAddress,
    useCacheBuster?: boolean,
  ): ResultAsync<string, MerchantValidationError> {
    // If there is no merchant URL set, it's not an error
    if (merchantUrl == "") {
      return okAsync("");
    }

    let cacheBuster: string = "";
    if (useCacheBuster) {
      cacheBuster = `?v=${Date.now()}`;
    }

    return this.merchantConnectorRepository.getMerchantCode(merchantUrl + cacheBuster).andThen((merchantCode) => {
      const calculatedAddress = ethers.utils.verifyMessage(merchantCode, signature);

      if (calculatedAddress !== address) {
        return errAsync<string, MerchantValidationError>(
          new MerchantValidationError("Merchant code does not match signature!"),
        );
      }

      // Merchant's code passes muster. Store the merchant code in the context as validated.
      this.contextProvider.setValidatedMerchantConnector(merchantCode, signature);

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

    if (context.validatedMerchantSignature != null && activatedMerchants.includes(context.validatedMerchantSignature) && context.publicIdentifier != null) {
      return this.activateMerchantConnector(context.publicIdentifier, new Balances([]));
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

  public publicIdentifierReceived(publicIdentifier: PublicIdentifier): ResultAsync<void, LogicalError> {
    const context = this.contextProvider.getMerchantContext();
    context.publicIdentifier = publicIdentifier;
    this.contextProvider.setMerchantContext(context);
    context.merchantConnector?.onPublicIdentifierReceived(publicIdentifier); 
    return okAsync(undefined);
  }

  public getValidatedSignature(): ResultAsync<Signature, MerchantValidationError> {
    let context = this.contextProvider.getMerchantContext();
    return context.merchantValidated.map(() => {
      context = this.contextProvider.getMerchantContext();
      
      if (context.validatedMerchantSignature == null) {
        throw new Error("validatedMerchantSignature is null but merchantValidated is OK");
      }

      return context.validatedMerchantSignature;
    });
  }
  getAddress(): ResultAsync<EthereumAddress, MerchantValidationError> {
    let context = this.contextProvider.getMerchantContext();
    return context.merchantValidated
    .andThen(() => {
      if (context.merchantConnector == null) {
        throw new Error("merchantConnector is null but merchantValidated is OK");
      }

      return ResultAsync.fromPromise(context.merchantConnector.getAddress(), 
      (e) => e as MerchantConnectorError);
    });
  }
  
  
  public resolveChallenge(paymentId: PaymentId): ResultAsync<IResolutionResult, MerchantConnectorError | MerchantValidationError> {
    let context = this.contextProvider.getMerchantContext();
    return context.merchantValidated
    .andThen(() => {
      if (context.merchantConnector == null) {
        throw new Error("merchantConnector is null but merchantValidated is OK");
      }

      return ResultAsync.fromPromise(context.merchantConnector.resolveChallenge(paymentId), 
      (e) => e as MerchantConnectorError);
    });
  }
}
