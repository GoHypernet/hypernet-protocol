import { IMerchantConnectorRepository } from "@interfaces/data";
import { HexString, PublicKey } from "@interfaces/objects";
import { MerchantConnectorError, PersistenceError } from "@interfaces/objects/errors";
import { okAsync, ResultAsync } from "neverthrow";
import { ParentProxy, ResultUtils } from "@hypernetlabs/utils";
import { IBlockchainProvider } from "@interfaces/utilities";

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
}

interface IAuthorizedMerchantEntry {
  merchantUrl: string;
  authorizationSignature: string;
}

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  protected activatedMerchants: Map<URL, MerchantConnectorProxy>;

  constructor(protected blockchainProvider: IBlockchainProvider) {
    this.activatedMerchants = new Map();
  }

  public getMerchantConnectorSignature(merchantUrl: URL): ResultAsync<string, Error> {
    throw new Error("Method not implemented.");
  }

  public getMerchantPublicKey(merchantUrl: URL): ResultAsync<PublicKey, Error> {
    throw new Error("Method not implemented.");
  }

  public addAuthorizedMerchant(merchantUrl: URL, merchantSignature: string): ResultAsync<void, PersistenceError> {
    return this.blockchainProvider.getSigner()
    .andThen((signer) => {
      return ResultAsync.fromPromise(signer.signMessage(merchantSignature),
      e => e as MerchantConnectorError);
    })
    .map((authorizationSignature) => {
      const authorizedMerchants = this._getAuthorizedMerchants();
      
      authorizedMerchants.set(merchantUrl, authorizationSignature);

      this._setAuthorizedMerchants(authorizedMerchants);
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
      authorizedMerchants.set(new URL(authorizedMerchantEntry.merchantUrl), 
      authorizedMerchantEntry.authorizationSignature);
    }
    return authorizedMerchants;
  }

  // public initialize(): ResultAsync<void, MerchantConnectorError> {

  // }

  public activateMerchants(merchantUrls: URL[]): ResultAsync<void, MerchantConnectorError> {
    const activationResults = new Array<ResultAsync<void, Error>>();
    
    for (const merchantUrl of merchantUrls) {
      const proxy = new MerchantConnectorProxy(null, merchantUrl.toString());
      this.activatedMerchants.set(merchantUrl, proxy);
      activationResults.push(proxy.activate());
    }

    return ResultUtils.combine(activationResults)
    .map(() => {});
  }
}
