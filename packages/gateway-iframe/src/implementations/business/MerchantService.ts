import {
  IGatewayConnector,
  IRedirectInfo,
  IResolutionResult,
} from "@hypernetlabs/gateway-connector";
import {
  LogicalError,
  PublicIdentifier,
  Balances,
  EthereumAddress,
  Signature,
  GatewayUrl,
  PaymentId,
  AjaxError,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IMerchantService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
  IMerchantConnectorRepository,
  IMerchantConnectorRepositoryType,
  IPersistenceRepository,
  IPersistenceRepositoryType,
} from "@gateway-iframe/interfaces/data";
import { ExpectedRedirect } from "@gateway-iframe/interfaces/objects";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  MerchantConnectorError,
  MerchantValidationError,
} from "@gateway-iframe/interfaces/objects/errors";
import {
  IContextProvider,
  IContextProviderType,
} from "@gateway-iframe/interfaces/utils";

declare global {
  interface Window {
    connector: IGatewayConnector;
  }
}

@injectable()
export class MerchantService implements IMerchantService {
  protected signMessageCallbacks: Map<
    string,
    (message: string, signature: Signature) => void
  >;

  constructor(
    @inject(IMerchantConnectorRepositoryType)
    protected merchantConnectorRepository: IMerchantConnectorRepository,
    @inject(IPersistenceRepositoryType)
    protected persistenceRepository: IPersistenceRepository,
    @inject(IHypernetCoreRepositoryType)
    protected hypernetCoreRepository: IHypernetCoreRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.signMessageCallbacks = new Map();
  }
  private static merchantUrlCacheBusterUsed = false;

  public activateMerchantConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<
    IGatewayConnector,
    MerchantConnectorError | MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();
    console.log(`Activating merchant connector for ${context.gatewayUrl}`);
    // If we don't have validated code, that's a problem.
    if (
      context.validatedMerchantCode == null ||
      context.validatedMerchantSignature == null
    ) {
      return errAsync(
        new MerchantValidationError(
          "Cannot activate merchant connector, no validated code available!",
        ),
      );
    }

    if (publicIdentifier == null) {
      return errAsync(
        new LogicalError(
          "Cannot activate merchant connector, public identifier is unknown!",
        ),
      );
    }

    // We will now run the connector code. It needs to put an IGatewayConnector object in the window.connector
    const newScript = document.createElement("script");
    const inlineScript = document.createTextNode(context.validatedMerchantCode);
    newScript.appendChild(inlineScript);
    document.head.appendChild(newScript);

    const merchantConnector = window.connector;

    if (merchantConnector == null) {
      return errAsync(
        new MerchantConnectorError(
          "Validated code does not evaluate to an object",
        ),
      );
    }

    // Send some initial information to the merchant connector
    merchantConnector.onPublicIdentifierReceived(publicIdentifier);

    merchantConnector.onBalancesReceived(balances);

    // Store the merchant connector object and notify the world
    context.merchantConnector = merchantConnector;
    this.contextProvider.setMerchantContext(context);
    context.onMerchantConnectorActivated.next(merchantConnector);

    // Once a connector has been activated once during the session, we can
    // reactivate it automatically on startup.
    this.persistenceRepository.addActivatedMerchantSignature(
      context.validatedMerchantSignature,
    );

    return okAsync(merchantConnector);
  }

  public validateMerchantConnector(): ResultAsync<
    Signature,
    MerchantValidationError
  > {
    // This is going to connect to the gatewayUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at gatewayUrl/address
    // The code will be cached in local storage but the signing key will be
    const context = this.contextProvider.getMerchantContext();
    let signature = Signature("");
    let address = EthereumAddress("");

    // If there is no merchant URL set, it's not an error
    if (context.gatewayUrl == "") {
      return okAsync(Signature(""));
    }

    return ResultUtils.combine([
      this.merchantConnectorRepository.getMerchantSignature(
        context.gatewayUrl,
      ),
      this.merchantConnectorRepository.getMerchantAddress(context.gatewayUrl),
    ])
      .andThen((vals) => {
        [signature, address] = vals;

        return this._validateMerchantConnectorCode(
          context.gatewayUrl,
          signature,
          address,
        );
      })
      .orElse((e) => {
        if (!MerchantService.merchantUrlCacheBusterUsed) {
          MerchantService.merchantUrlCacheBusterUsed = true;
          return this._validateMerchantConnectorCode(
            context.gatewayUrl,
            signature,
            address,
            true,
          );
        } else {
          return errAsync(e);
        }
      })
      .mapErr((e) => {
        // Error occured; we tried recovery above, so now we need to mark
        // the validation process as failed.
        this.contextProvider.setValidatedMerchantConnectorFailed(e);

        return e;
      });
  }

  private _validateMerchantConnectorCode(
    gatewayUrl: GatewayUrl,
    signature: Signature,
    address: EthereumAddress,
    useCacheBuster?: boolean,
  ): ResultAsync<Signature, MerchantValidationError | AjaxError> {
    // If there is no merchant URL set, it's not an error
    if (gatewayUrl == "") {
      return okAsync(Signature(""));
    }

    let cacheBuster = "";
    if (useCacheBuster) {
      cacheBuster = `?v=${Date.now()}`;
    }

    return this.merchantConnectorRepository
      .getMerchantCode(GatewayUrl(gatewayUrl + cacheBuster))
      .andThen((merchantCode) => {
        const calculatedAddress = ethers.utils.verifyMessage(
          merchantCode,
          signature,
        );

        if (calculatedAddress !== address) {
          return errAsync<Signature, MerchantValidationError>(
            new MerchantValidationError(
              "Gateway code does not match signature!",
            ),
          );
        }

        // Gateway's code passes muster. Store the merchant code in the context as validated.
        this.contextProvider.setValidatedMerchantConnector(
          merchantCode,
          signature,
        );

        // Return the valid signature
        return okAsync<Signature, MerchantValidationError>(signature);
      });
  }

  public prepareForRedirect(
    redirectInfo: IRedirectInfo,
  ): ResultAsync<void, Error> {
    const context = this.contextProvider.getMerchantContext();

    // Register the redirect
    this.persistenceRepository.setExpectedRedirect(
      new ExpectedRedirect(
        context.gatewayUrl,
        redirectInfo.redirectParam,
        redirectInfo.redirectValue,
      ),
    );

    // Let the connector know it can move forward
    redirectInfo.readyFunction();

    // Return
    return okAsync(undefined);
  }

  public autoActivateMerchantConnector(): ResultAsync<
    IGatewayConnector | null,
    MerchantConnectorError | MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();

    // We can auto-activate the merchant connector if the connector
    // had been previously activated in this session.
    const activatedMerchants = this.persistenceRepository.getActivatedMerchantSignatures();

    if (
      context.validatedMerchantSignature != null &&
      activatedMerchants.includes(context.validatedMerchantSignature) &&
      context.publicIdentifier != null
    ) {
      return this.activateMerchantConnector(
        context.publicIdentifier,
        new Balances([]),
      );
    }

    return okAsync(null);
  }

  public getMerchantUrl(): ResultAsync<GatewayUrl, MerchantValidationError> {
    // First, see if this is going to be easy. Normally a gatewayUrl
    // is provided as a param.
    const urlParams = new URLSearchParams(window.location.search);
    const gatewayUrl = urlParams.get("gatewayUrl");

    if (gatewayUrl != null) {
      return okAsync(GatewayUrl(gatewayUrl));
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
        const paramValue = urlParams.get(expectedRedirect.redirectParam);

        if (paramValue == expectedRedirect.paramValue) {
          return okAsync(expectedRedirect.gatewayUrl);
        }
      }
    }
    return errAsync(
      new MerchantValidationError("gatewayUrl can not be determined!"),
    );
  }

  public publicIdentifierReceived(
    publicIdentifier: PublicIdentifier,
  ): ResultAsync<void, LogicalError> {
    const context = this.contextProvider.getMerchantContext();
    context.publicIdentifier = publicIdentifier;
    this.contextProvider.setMerchantContext(context);
    context.merchantConnector?.onPublicIdentifierReceived(publicIdentifier);
    return okAsync(undefined);
  }

  public getValidatedSignature(): ResultAsync<
    Signature,
    MerchantValidationError
  > {
    let context = this.contextProvider.getMerchantContext();
    return context.merchantValidated.map(() => {
      context = this.contextProvider.getMerchantContext();

      if (context.validatedMerchantSignature == null) {
        throw new Error(
          "validatedMerchantSignature is null but merchantValidated is OK",
        );
      }

      return context.validatedMerchantSignature;
    });
  }

  public getAddress(): ResultAsync<EthereumAddress, MerchantValidationError> {
    return this._getValidatedMerchantConnector().andThen(
      (merchantConnector) => {
        return ResultAsync.fromPromise(
          merchantConnector.getAddress(),
          (e) => new MerchantConnectorError(
            "Error happened while getting merchant connector addresses",
            e
          ),
        );
      },
    );
  }

  public resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<
    IResolutionResult,
    MerchantConnectorError | MerchantValidationError
  > {
    return this._getValidatedMerchantConnector().andThen(
      (merchantConnector) => {
        return ResultAsync.fromPromise(
          merchantConnector.resolveChallenge(paymentId),
          (e) => new MerchantConnectorError(
            "Error happened while resolving challenge in merchant connector code",
            e
          ),
        );
      },
    );
  }

  public deauthorize(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError
  > {
    return this._getValidatedMerchantConnector().andThen(
      (merchantConnector) => {
        return ResultAsync.fromPromise(
          merchantConnector.deauthorize(),
          (e) => new MerchantConnectorError(
            "Error happened while deauthorizing merchant in merchant connector code",
            e
          ),
        );
      },
    );
  }

  public signMessage(
    message: string,
    callback: (message: string, signature: Signature) => void,
  ): ResultAsync<void, never> {
    // Need to stash the callback so that when the answer is
    // transmitted back, we can call it.
    this.signMessageCallbacks.set(message, callback);

    return this.hypernetCoreRepository.emitSignMessageRequested(message);
  }

  public messageSigned(
    message: string,
    signature: Signature,
  ): ResultAsync<void, never> {
    // We have a signature for a message, find the callback
    const callback = this.signMessageCallbacks.get(message);

    if (callback != null) {
      callback(message, signature);
    }

    return okAsync(undefined);
  }

  private _getValidatedMerchantConnector(): ResultAsync<
    IGatewayConnector,
    MerchantValidationError
  > {
    const context = this.contextProvider.getMerchantContext();
    return context.merchantValidated.map(() => {
      if (context.merchantConnector == null) {
        throw new Error(
          "merchantConnector is null but merchantValidated is OK",
        );
      }

      return context.merchantConnector;
    });
  }
}
