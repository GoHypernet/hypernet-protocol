import {
  ProxyError,
  Signature,
  GatewayUrl,
  AuthorizedGatewaysSchema,
  PersistenceError,
  GatewayRegistrationInfo,
  VectorError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import {
  IGatewayConnectorRepository,
  IAuthorizedGatewayEntry,
} from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
import { IGatewayConnectorProxy } from "@interfaces/utilities";
import {
  IGatewayConnectorProxyFactory,
  IGatewayConnectorProxyFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class GatewayConnectorRepository implements IGatewayConnectorRepository {
  protected existingProxies: Map<GatewayUrl, IGatewayConnectorProxy>;
  protected proxyPromises: Map<GatewayUrl, Promise<IGatewayConnectorProxy>>;
  protected proxyResolvers: Map<
    GatewayUrl,
    (resolve: IGatewayConnectorProxy) => void
  >;
  protected proxyRejectors: Map<GatewayUrl, (reject: ProxyError) => void>;

  constructor(
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IGatewayConnectorProxyFactoryType)
    protected gatewayConnectorProxyFactory: IGatewayConnectorProxyFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.existingProxies = new Map();
    this.proxyPromises = new Map();
    this.proxyResolvers = new Map();
    this.proxyRejectors = new Map();
  }

  public getGatewayProxy(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError> {
    // If the proxy already exists, return it
    const existingProxy = this.existingProxies.get(gatewayUrl);
    if (existingProxy != null) {
      return okAsync(existingProxy);
    }

    this.logUtils.debug(
      `Gateway proxy for ${gatewayUrl} requested but it has not been created yet`,
    );

    // The proxy does not exist yet, see if we have an existing request for it
    let existingRequest = this.proxyPromises.get(gatewayUrl);

    if (existingRequest == null) {
      // No existing request, create one.
      existingRequest = new Promise((resolve, reject) => {
        this.proxyResolvers.set(gatewayUrl, resolve);
        this.proxyRejectors.set(gatewayUrl, reject);
      });
      this.proxyPromises.set(gatewayUrl, existingRequest);
    }

    return ResultAsync.fromPromise(existingRequest, (e) => {
      return e as ProxyError;
    });
  }

  public createGatewayProxy(
    gatewayRegistrationInfo: GatewayRegistrationInfo,
  ): ResultAsync<IGatewayConnectorProxy, ProxyError> {
    this.logUtils.debug(`Creating proxy for ${gatewayRegistrationInfo.url}`);
    // Check if we have an existing proxy!
    const existingProxy = this.existingProxies.get(gatewayRegistrationInfo.url);

    if (existingProxy != null) {
      return okAsync(existingProxy);
    }

    return this.gatewayConnectorProxyFactory
      .factoryProxy(gatewayRegistrationInfo)
      .andThen((proxy) => {
        return proxy.activateProxy().map(() => {
          // Success!
          // Add it to the cache
          this.existingProxies.set(gatewayRegistrationInfo.url, proxy);

          // Look for if we have any existing requests out there.
          const existingRequest = this.proxyPromises.get(
            gatewayRegistrationInfo.url,
          );

          if (existingRequest != null) {
            const existingResolver = this.proxyResolvers.get(
              gatewayRegistrationInfo.url,
            );

            if (existingResolver != null) {
              existingResolver(proxy);
            }

            this.proxyResolvers.delete(gatewayRegistrationInfo.url);
            this.proxyRejectors.delete(gatewayRegistrationInfo.url);
            this.proxyPromises.delete(gatewayRegistrationInfo.url);
          }

          return proxy;
        });
      })
      .mapErr((e) => {
        // Error creating the proxy
        // Look for if we have any existing requests out there.
        const existingRequest = this.proxyPromises.get(
          gatewayRegistrationInfo.url,
        );

        if (existingRequest != null) {
          const existingRejector = this.proxyRejectors.get(
            gatewayRegistrationInfo.url,
          );

          if (existingRejector != null) {
            existingRejector(e);
          }

          this.proxyPromises.delete(gatewayRegistrationInfo.url);
          this.proxyResolvers.delete(gatewayRegistrationInfo.url);
          this.proxyRejectors.delete(gatewayRegistrationInfo.url);
        }
        return e;
      });
  }

  public addAuthorizedGateway(
    gatewayUrl: GatewayUrl,
    authorizationSignature: Signature,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.getAuthorizedGateways().andThen((authorizedGateways) => {
      // The connector has been authorized, store it as an authorized connector
      authorizedGateways.set(gatewayUrl, authorizationSignature);

      return this._setAuthorizedGateways(authorizedGateways);
    });
  }

  /**
   * Returns a map of gateway URLs with their authorization signatures.
   */
  public getAuthorizedGateways(): ResultAsync<
    Map<GatewayUrl, Signature>,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.storageUtils
      .read<IAuthorizedGatewayEntry[]>(AuthorizedGatewaysSchema.title)
      .map((storedAuthorizedGateways) => {
        const authorizedGateways = new Map<GatewayUrl, Signature>();

        if (storedAuthorizedGateways != null) {
          for (const authorizedGatewayEntry of storedAuthorizedGateways) {
            authorizedGateways.set(
              GatewayUrl(authorizedGatewayEntry.gatewayUrl),
              Signature(authorizedGatewayEntry.authorizationSignature),
            );
          }
        }

        return authorizedGateways;
      });
  }

  public deauthorizeGateway(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.getAuthorizedGateways().andThen((authorizedGateways) => {
      authorizedGateways.delete(gatewayUrl);

      return this._setAuthorizedGateways(authorizedGateways);
    });
  }

  public destroyProxy(gatewayUrl: GatewayUrl): void {
    const proxy = this.existingProxies.get(gatewayUrl);
    if (proxy != null) {
      proxy.destroy();
      this.existingProxies.delete(gatewayUrl);
    }
  }

  protected _setAuthorizedGateways(
    authorizedGatewayMap: Map<GatewayUrl, Signature>,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    const authorizedGatewayEntries = new Array<IAuthorizedGatewayEntry>();

    for (const [gatewayUrl, authorizationSignature] of authorizedGatewayMap) {
      authorizedGatewayEntries.push({
        gatewayUrl: GatewayUrl(gatewayUrl),
        authorizationSignature: Signature(authorizationSignature),
      });
    }

    return this.storageUtils.write<IAuthorizedGatewayEntry[]>(
      AuthorizedGatewaysSchema.title,
      authorizedGatewayEntries,
    );
  }
}
