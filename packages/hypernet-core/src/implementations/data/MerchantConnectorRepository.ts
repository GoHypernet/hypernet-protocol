import { IMerchantConnectorRepository } from "@interfaces/data";
import { HexString, PublicKey } from "@interfaces/objects";
import { CoreUninitializedError, MerchantConnectorError, MerchantValidationError, PersistenceError } from "@interfaces/objects/errors";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ParentProxy, ResultUtils, IAjaxUtils } from "@hypernetlabs/utils";
import { IBlockchainProvider, IConfigProvider, IContextProvider } from "@interfaces/utilities";
import {ethers} from "ethers";

class MerchantConnectorProxy extends ParentProxy {
  constructor(element: HTMLElement | null, iframeUrl: string) {
    super(element, iframeUrl);
  }

  public activateConnector(): ResultAsync<void, MerchantConnectorError> {
    const call = this._createCall("activateConnector", null);

    return call.getResult();
  }

  public resolveChallenge(paymentId: HexString): ResultAsync<void, MerchantConnectorError> {
    const call = this._createCall("resolveChallenge", null);

    return call.getResult();
  }

  public getPublicKey(): ResultAsync<PublicKey, MerchantConnectorError> {
    const call = this._createCall("getPublicKey", null);

    return call.getResult();
  }

  public getValidatedSignature(): ResultAsync<string, MerchantValidationError> {
    const call = this._createCall("getValidatedSignature", null);

    return call.getResult();
  }
}

interface IAuthorizedMerchantEntry {
  merchantUrl: string;
  authorizationSignature: string;
}

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  protected activatedMerchants: Map<URL, MerchantConnectorProxy>;

  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected ajaxUtils: IAjaxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
  ) {
    this.activatedMerchants = new Map();
  }

  public getMerchantConnectorSignature(merchantUrl: URL): ResultAsync<string, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "signature";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantPublicKey(merchantUrl: URL): ResultAsync<PublicKey, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "publicKey";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public addAuthorizedMerchant(merchantUrl: URL): ResultAsync<void, PersistenceError> {
    console.log("In addAuthorizedMerchant!");
    let proxy: MerchantConnectorProxy;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // First, we will create the proxy
        proxy = this._factoryProxy(config.merchantIframeUrl, merchantUrl);

        console.log("Activating proxy!");
        return proxy.activate();
      })
      .andThen(() => {
        console.log("Proxy activated, getting validated signature!");
        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([proxy.getValidatedSignature(), this.blockchainProvider.getSigner()]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

        console.log(`Validated signature: ${merchantSignature}`);

        // merchantSignature has been validated by the iframe, so this is already confirmed.
        // Now we need to get an authorization signature
        return ResultAsync.fromPromise(signer.signMessage(merchantSignature), (e) => e as MerchantConnectorError);
      })
      .andThen((authorizationSignature) => {
        const authorizedMerchants = this._getAuthorizedMerchants();

        authorizedMerchants.set(merchantUrl, authorizationSignature);

        this._setAuthorizedMerchants(authorizedMerchants);

        // Activate the merchant connector
        return proxy.activateConnector();
      })
      .map(() => {
        this.activatedMerchants.set(merchantUrl, proxy);
      });
  }

  public getAuthorizedMerchants(): ResultAsync<Map<URL, string>, PersistenceError> {
    const authorizedMerchants = this._getAuthorizedMerchants();

    return okAsync(authorizedMerchants);
  }

  protected _setAuthorizedMerchants(authorizedMerchantMap: Map<URL, string>) {
    const authorizedMerchantEntries = new Array<IAuthorizedMerchantEntry>();
    for (const keyval of authorizedMerchantMap) {
      authorizedMerchantEntries.push({merchantUrl: keyval[0].toString(), 
        authorizationSignature: keyval[1]});
    }
    window.localStorage.setItem("AuthorizedMerchants", JSON.stringify(authorizedMerchantEntries));
  }

  protected _getAuthorizedMerchants(): Map<URL, string> {
    let authorizedMerchantStr = window.localStorage.getItem("AuthorizedMerchants");

    if (authorizedMerchantStr == null) {
      authorizedMerchantStr = "[]";
    }
    const authorizedMerchantEntries = JSON.parse(authorizedMerchantStr) as IAuthorizedMerchantEntry[];

    const authorizedMerchants = new Map<URL, string>();
    for (const authorizedMerchantEntry of authorizedMerchantEntries) {
      authorizedMerchants.set(
        new URL(authorizedMerchantEntry.merchantUrl),
        authorizedMerchantEntry.authorizationSignature,
      );
    }
    return authorizedMerchants;
  }

  // public initialize(): ResultAsync<void, MerchantConnectorError> {

  // }

  public activateAuthorizedMerchants(): ResultAsync<void, MerchantConnectorError | MerchantValidationError | CoreUninitializedError> {
    return ResultUtils.combine([this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.getAuthorizedMerchants()]).andThen((vals) => {
        const [config, context, authorizedMerchants] = vals;
      const activationResults = new Array<ResultAsync<void, Error>>();

      for (const keyval of authorizedMerchants) {
        activationResults.push(this._activateAuthorizedMerchant(context.account, 
          keyval[0], 
          keyval[1], 
          config.merchantIframeUrl));
      }

      return ResultUtils.combine(activationResults).map(() => {});
    });
  }

  protected _activateAuthorizedMerchant(address: string,
    merchantUrl: URL, 
    authorizationSignature: string,
     merchantIFrameUrl: string): ResultAsync<void, MerchantConnectorError | MerchantValidationError> {
    const proxy = this._factoryProxy(merchantIFrameUrl, merchantUrl);
    return proxy.activate().andThen(() => {
      // Once the proxy is activated, we need to get the validated signature
      return proxy.getValidatedSignature();
    })
    .andThen((validatedSignature) => {
      const validationAddress = ethers.utils.verifyMessage(validatedSignature, authorizationSignature);

      if (validationAddress !== address) {
        // TODO: this is recoverable, we just need a new signature
        return errAsync(new MerchantValidationError("Validated signature of merchant connector does not match signature on file. Need to re-authorized the connector!"));
      }

      return proxy.activateConnector();
    });
  }

  protected _factoryProxy(merchantIFrameUrl: string, merchantUrl: URL): MerchantConnectorProxy {
    const iframeUrl = new URL(merchantIFrameUrl);
    iframeUrl.searchParams.set("merchantUrl", merchantUrl.toString());
    const proxy = new MerchantConnectorProxy(null, iframeUrl.toString());
    return proxy;
  }
}
