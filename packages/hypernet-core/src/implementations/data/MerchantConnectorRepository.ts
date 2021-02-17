import { IMerchantConnectorRepository } from "@interfaces/data";
import { HexString, PublicKey } from "@interfaces/objects";
import { MerchantConnectorError, MerchantValidationError, PersistenceError } from "@interfaces/objects/errors";
import { okAsync, ResultAsync } from "neverthrow";
import { ParentProxy, ResultUtils, IAjaxUtils } from "@hypernetlabs/utils";
import { IBlockchainProvider, IConfigProvider } from "@interfaces/utilities";

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
    let proxy: MerchantConnectorProxy;
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        // First, we will create the proxy
        proxy = this._factoryProxy(config.merchantIframeUrl, merchantUrl);

        return proxy.activate();
      })
      .andThen(() => {
        // With the proxy activated, we can get the validated merchant signature
        return ResultUtils.combine([proxy.getValidatedSignature(), this.blockchainProvider.getSigner()]);
      })
      .andThen((vals) => {
        const [merchantSignature, signer] = vals;

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

  public getAuthorizedMerchants(): ResultAsync<URL[], PersistenceError> {
    const authorizedMerchants = this._getAuthorizedMerchants();

    const authorizedUrls = new Array<URL>();
    for (const merchantUrl of authorizedMerchants.keys()) {
      authorizedUrls.push(merchantUrl);
    }

    return okAsync(authorizedUrls);
  }

  protected _setAuthorizedMerchants(authorizedMerchantMap: Map<URL, string>) {
    window.localStorage.setItem("AuthorizedMerchants", JSON.stringify(authorizedMerchantMap));
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

  public activateAuthorizedMerchants(merchantUrls: URL[]): ResultAsync<void, MerchantConnectorError> {
    return this.configProvider.getConfig().andThen((config) => {
      const activationResults = new Array<ResultAsync<void, Error>>();

      for (const merchantUrl of merchantUrls) {
        const proxy = this._factoryProxy(config.merchantIframeUrl, merchantUrl);
        this.activatedMerchants.set(merchantUrl, proxy);
        activationResults.push(proxy.activate());
      }

      return ResultUtils.combine(activationResults).map(() => {});
    });
  }

  protected _factoryProxy(merchantIFrameUrl: string, merchantUrl: URL): MerchantConnectorProxy {
    const iframeUrl = new URL(merchantIFrameUrl);
    iframeUrl.searchParams.set("merchantUrl", merchantUrl.toString());
    const proxy = new MerchantConnectorProxy(null, merchantUrl.toString());
    return proxy;
  }
}
