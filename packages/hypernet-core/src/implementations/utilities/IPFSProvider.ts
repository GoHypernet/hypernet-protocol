import {
  BlockchainUnavailableError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { IPFSHTTPClient, create } from "ipfs-http-client";

import {
  IContextProvider,
  IConfigProvider,
  IContextProviderType,
  IConfigProviderType,
  IIPFSProvider,
} from "@interfaces/utilities";
import {
  IInternalProviderFactory,
  IInternalProviderFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class IPFSProvider implements IIPFSProvider {
  protected initializeResult: ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > | null = null;

  protected provider: ethers.providers.JsonRpcProvider | null = null;

  protected httpClient: IPFSHTTPClient | null = null;

  protected gatewayUrl: string | null = null;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(IInternalProviderFactoryType)
    protected internalProviderFactory: IInternalProviderFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  private initialized = false;
  
  public initialize(): ResultAsync<
    void,
    BlockchainUnavailableError | InvalidParametersError
  > {
    if (this.initializeResult == null) {
      this.logUtils.debug("Initializing IPFSProvider");

      this.initializeResult = this.configProvider
        .getConfig()
        .map((config) => {
          const storedGatewayUrl =
            this.localStorageUtils.getItem("IPFSGatewayUrl");

          // TODO: add IPFS Gateway Url to config and use here.
          this.gatewayUrl = storedGatewayUrl || config.authUrl;

          // TODO: add IPFS API Url to config and use here.
          const ipfs = create({ url: config.authUrl });
          return ipfs.isOnline();
        })
        .map((isOnline) => {
          if (isOnline) {
            this.initialized = true;
          }
        });
    }
    return this.initializeResult;
  }

  /**
   * Returns an IPFS http client to communicate with a remote IPFS node.
   * @return IPFSHTTPClient
   */
  public getHttpClient(): ResultAsync<IPFSHTTPClient, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call IPFSProvider.initialize() first before you can call getHttpClient()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.httpClient as IPFSHTTPClient;
      })
      .orElse((e) => {
        this.logUtils.error(e);
        throw new Error(
          "Initialization unsuccessful, you should not have called getHttpClient()",
        );
      });
  }

  /**
   * Returns IPFS gateway url which could be from local storage or the default one from config.
   * @return a string
   */
  public getGatewayUrl(): ResultAsync<string, never> {
    if (this.initializeResult == null) {
      throw new Error(
        "Must call IPFSProvider.initialize() first before you can call getGatewayUrl()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.gatewayUrl as string;
      })
      .orElse((e) => {
        this.logUtils.error(e);
        throw new Error(
          "Initialization unsuccessful, you should not have called getGatewayUrl()",
        );
      });
  }

  /**
   * Sets gateway url to the value passed and updates local storage for the further initializations.
   * @param gatewayUrl string
   */
  public setGatewayUrl(gatewayUrl: string) {
    this.gatewayUrl = gatewayUrl;
    this.localStorageUtils.setItem("IPFSGatewayUrl", gatewayUrl);
  }
}
