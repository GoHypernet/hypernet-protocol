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
import { ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IGatewayService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
  IGatewayConnectorRepository,
  IGatewayConnectorRepositoryType,
  IPersistenceRepository,
  IPersistenceRepositoryType,
} from "@gateway-iframe/interfaces/data";
import { ExpectedRedirect } from "@gateway-iframe/interfaces/objects";
import {
  GatewayConnectorError,
  GatewayValidationError,
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
export class GatewayService implements IGatewayService {
  protected signMessageCallbacks: Map<
    string,
    (message: string, signature: Signature) => void
  >;

  constructor(
    @inject(IGatewayConnectorRepositoryType)
    protected gatewayConnectorRepository: IGatewayConnectorRepository,
    @inject(IPersistenceRepositoryType)
    protected persistenceRepository: IPersistenceRepository,
    @inject(IHypernetCoreRepositoryType)
    protected hypernetCoreRepository: IHypernetCoreRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.signMessageCallbacks = new Map();
  }
  private static gatewayUrlCacheBusterUsed = false;

  public activateGatewayConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<
    IGatewayConnector,
    GatewayConnectorError | GatewayValidationError
  > {
    const context = this.contextProvider.getGatewayContext();
    console.log(`Activating gateway connector for ${context.gatewayUrl}`);
    // If we don't have validated code, that's a problem.
    if (
      context.validatedGatewayCode == null ||
      context.validatedGatewaySignature == null
    ) {
      return errAsync(
        new GatewayValidationError(
          "Cannot activate gateway connector, no validated code available!",
        ),
      );
    }

    if (publicIdentifier == null) {
      return errAsync(
        new LogicalError(
          "Cannot activate gateway connector, public identifier is unknown!",
        ),
      );
    }

    // We will now run the connector code. It needs to put an IGatewayConnector object in the window.connector
    const newScript = document.createElement("script");
    const inlineScript = document.createTextNode(context.validatedGatewayCode);
    newScript.appendChild(inlineScript);
    document.head.appendChild(newScript);

    const gatewayConnector = window.connector;

    if (gatewayConnector == null) {
      return errAsync(
        new GatewayConnectorError(
          "Validated code does not evaluate to an object",
        ),
      );
    }

    // Send some initial information to the gateway connector
    gatewayConnector.onPublicIdentifierReceived(publicIdentifier);

    gatewayConnector.onBalancesReceived(balances);

    // Store the gateway connector object and notify the world
    context.gatewayConnector = gatewayConnector;
    this.contextProvider.setGatewayContext(context);
    context.onGatewayConnectorActivated.next(gatewayConnector);

    // Once a connector has been activated once during the session, we can
    // reactivate it automatically on startup.
    this.persistenceRepository.addActivatedGatewaySignature(
      context.validatedGatewaySignature,
    );

    return okAsync(gatewayConnector);
  }

  public validateGatewayConnector(): ResultAsync<
    Signature,
    GatewayValidationError
  > {
    // This is going to connect to the gatewayUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at gatewayUrl/address
    // The code will be cached in local storage but the signing key will be
    const context = this.contextProvider.getGatewayContext();
    let signature = Signature("");
    let address = EthereumAddress("");

    // If there is no gateway URL set, it's not an error
    if (context.gatewayUrl == "") {
      return okAsync(Signature(""));
    }

    return ResultUtils.combine([
      this.gatewayConnectorRepository.getGatewaySignature(context.gatewayUrl),
      this.gatewayConnectorRepository.getGatewayAddress(context.gatewayUrl),
    ])
      .andThen((vals) => {
        [signature, address] = vals;

        return this._validateGatewayConnectorCode(
          context.gatewayUrl,
          signature,
          address,
        );
      })
      .orElse((e) => {
        if (!GatewayService.gatewayUrlCacheBusterUsed) {
          GatewayService.gatewayUrlCacheBusterUsed = true;
          return this._validateGatewayConnectorCode(
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
        this.contextProvider.setValidatedGatewayConnectorFailed(e);

        return e;
      });
  }

  private _validateGatewayConnectorCode(
    gatewayUrl: GatewayUrl,
    signature: Signature,
    address: EthereumAddress,
    useCacheBuster?: boolean,
  ): ResultAsync<Signature, GatewayValidationError | AjaxError> {
    // If there is no gateway URL set, it's not an error
    if (gatewayUrl == "") {
      return okAsync(Signature(""));
    }

    let cacheBuster = "";
    if (useCacheBuster) {
      cacheBuster = `?v=${Date.now()}`;
    }

    return this.gatewayConnectorRepository
      .getGatewayCode(GatewayUrl(gatewayUrl + cacheBuster))
      .andThen((gatewayCode) => {
        const calculatedAddress = ethers.utils.verifyMessage(
          gatewayCode,
          signature,
        );

        if (calculatedAddress !== address) {
          return errAsync<Signature, GatewayValidationError>(
            new GatewayValidationError(
              "Gateway code does not match signature!",
            ),
          );
        }

        // Gateway's code passes muster. Store the gateway code in the context as validated.
        this.contextProvider.setValidatedGatewayConnector(
          gatewayCode,
          signature,
        );

        // Return the valid signature
        return okAsync<Signature, GatewayValidationError>(signature);
      });
  }

  public prepareForRedirect(
    redirectInfo: IRedirectInfo,
  ): ResultAsync<void, Error> {
    const context = this.contextProvider.getGatewayContext();

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

  public autoActivateGatewayConnector(): ResultAsync<
    IGatewayConnector | null,
    GatewayConnectorError | GatewayValidationError
  > {
    const context = this.contextProvider.getGatewayContext();

    // We can auto-activate the gateway connector if the connector
    // had been previously activated in this session.
    const activatedGateways =
      this.persistenceRepository.getActivatedGatewaySignatures();

    if (
      context.validatedGatewaySignature != null &&
      activatedGateways.includes(context.validatedGatewaySignature) &&
      context.publicIdentifier != null
    ) {
      return this.activateGatewayConnector(
        context.publicIdentifier,
        new Balances([]),
      );
    }

    return okAsync(null);
  }

  public getGatewayUrl(): ResultAsync<GatewayUrl, GatewayValidationError> {
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
      new GatewayValidationError("gatewayUrl can not be determined!"),
    );
  }

  public publicIdentifierReceived(
    publicIdentifier: PublicIdentifier,
  ): ResultAsync<void, LogicalError> {
    const context = this.contextProvider.getGatewayContext();
    context.publicIdentifier = publicIdentifier;
    this.contextProvider.setGatewayContext(context);
    context.gatewayConnector?.onPublicIdentifierReceived(publicIdentifier);
    return okAsync(undefined);
  }

  public getValidatedSignature(): ResultAsync<
    Signature,
    GatewayValidationError
  > {
    let context = this.contextProvider.getGatewayContext();
    return context.gatewayValidated.map(() => {
      context = this.contextProvider.getGatewayContext();

      if (context.validatedGatewaySignature == null) {
        throw new Error(
          "validatedGatewaySignature is null but gatewayValidated is OK",
        );
      }

      return context.validatedGatewaySignature;
    });
  }

  public getAddress(): ResultAsync<EthereumAddress, GatewayValidationError> {
    return this._getValidatedGatewayConnector().andThen(
      (gatewayConnector) => {
        return ResultAsync.fromPromise(
          gatewayConnector.getAddress(),
          (e) =>
            new GatewayConnectorError(
              "Error happened while getting gateway connector addresses",
              e,
            ),
        );
      },
    );
  }

  public resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<
    IResolutionResult,
    GatewayConnectorError | GatewayValidationError
  > {
    return this._getValidatedGatewayConnector().andThen(
      (gatewayConnector) => {
        return ResultAsync.fromPromise(
          gatewayConnector.resolveChallenge(paymentId),
          (e) =>
            new GatewayConnectorError(
              "Error happened while resolving challenge in gateway connector code",
              e,
            ),
        );
      },
    );
  }

  public deauthorize(): ResultAsync<
    void,
    GatewayConnectorError | GatewayValidationError
  > {
    return this._getValidatedGatewayConnector().andThen(
      (gatewayConnector) => {
        return ResultAsync.fromPromise(
          gatewayConnector.deauthorize(),
          (e) =>
            new GatewayConnectorError(
              "Error happened while deauthorizing gateway in gateway connector code",
              e,
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

  private _getValidatedGatewayConnector(): ResultAsync<
    IGatewayConnector,
    GatewayValidationError
  > {
    const context = this.contextProvider.getGatewayContext();
    return context.gatewayValidated.map(() => {
      if (context.gatewayConnector == null) {
        throw new Error(
          "gatewayConnector is null but gatewayValidated is OK",
        );
      }

      return context.gatewayConnector;
    });
  }
}
