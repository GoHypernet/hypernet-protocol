import { IPFSUnavailableError } from "@hypernetlabs/objects";
import {
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { IPFSHTTPClient, create } from "ipfs-http-client";

import {
  IContextProvider,
  IConfigProvider,
  IContextProviderType,
  IConfigProviderType,
  IIPFSUtils,
} from "@interfaces/utilities";

export interface ToFile {
  path?: string;
  content:
    | string
    | InstanceType<typeof String>
    | ArrayBufferView
    | ArrayBuffer
    | Blob
    | ReadableStream<Uint8Array>;
}

/**
 * IPFSUtils contains methods for interacting directly with a remote IPFS node
 * to save files and retrieve them from the same node or any other configured gateway.
 */
export class IPFSUtils implements IIPFSUtils {
  protected initializeResult: ResultAsync<void, IPFSUnavailableError> | null =
    null;

  protected httpClient: IPFSHTTPClient | null = null;

  protected gatewayUrl: string | null = null;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {}

  private initialized = false;

  public initialize(): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      this.logUtils.debug("Initializing IPFSProvider");

      this.initializeResult = this.configProvider
        .getConfig()
        .andThen((config) => {
          const storedGatewayUrl =
            this.localStorageUtils.getItem("IPFSGatewayUrl");

          this.gatewayUrl =
            storedGatewayUrl ||
            config.governanceChainInformation.ipfsGatewayUrl;

          const ipfs = create({
            url: config.governanceChainInformation.ipfsApiUrl,
          });

          return ResultAsync.fromPromise(ipfs.version(), (e) => {
            this.logUtils.error("Failure during IPFS initialization");
            this.logUtils.error(e);

            throw new IPFSUnavailableError(
              "Failure during IPFS initialization",
            );
          }).map((ipfsVersion) => {
            if (ipfsVersion) {
              this.logUtils.log("IPFS initialized");
              this.httpClient = ipfs;
              this.initialized = true;
            }
          });
        });
    }
    return this.initializeResult;
  }

  /**
   * Returns an IPFS http client to communicate with a remote IPFS node.
   * @return ResultAsync<IPFSHTTPClient, IPFSUnavailableError>
   */
  public getHttpClient(): ResultAsync<IPFSHTTPClient, IPFSUnavailableError> {
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
        this.logUtils.error("Failure during getHttpClient() function call");
        this.logUtils.error(e);
        throw new IPFSUnavailableError(
          "Initialization unsuccessful, you should not have called getHttpClient()",
        );
      });
  }

  /**
   * Returns IPFS gateway url which could be from local storage or the default one from config.
   * @returns A ResultAsync containing gateway url as a string
   */
  public getGatewayUrl(): ResultAsync<string, IPFSUnavailableError> {
    if (this.initializeResult == null) {
      throw new IPFSUnavailableError(
        "Must call IPFSProvider.initialize() first before you can call getGatewayUrl()",
      );
    }

    return this.initializeResult
      .map(() => {
        return this.gatewayUrl as string;
      })
      .orElse((e) => {
        this.logUtils.error("Failure during getGatewayUrl() function call");
        this.logUtils.error(e);
        throw new IPFSUnavailableError(
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

  /**
   * Saves file to IPFS and returns a CID.
   * @param file
   * @returns A ResultAsync containing CID as a string
   */
  public saveFile(file: ToFile): ResultAsync<string, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }

    return ResultAsync.fromPromise(
      this.httpClient.add(file, {
        progress: (prog) => this.logUtils.log(`IPFS received: ${prog}`),
      }),
      (e) => {
        this.logUtils.error("Failure during saving file to IPFS");
        this.logUtils.error(e);
        throw new IPFSUnavailableError("Failure during saving file to IPFS.");
      },
    ).andThen((addResult) => {
      const cid = addResult.cid.toString();
      // Content added with saveFile() (which by default also becomes pinned), is not
      // added to MFS. Any content can be lazily referenced from MFS with copyFile().
      return this.copyFile(cid, file?.path).map(() => {
        return cid;
      });
    });
  }

  /**
   * Gets the related file with the given cid.
   * @param cid
   * @returns A ResultAsync containing response
   */
  public getFile(cid: string): ResultAsync<Response, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }

    const fileUrl = `${this.gatewayUrl}/ipfs/${cid}`;

    return ResultAsync.fromPromise(fetch(fileUrl), (e) => {
      this.logUtils.error("Failure during getting file from IPFS");
      this.logUtils.error(e);
      throw new IPFSUnavailableError("Failure during getting file from IPFS");
    });
  }

  /**
   * Copies files from one location to another.
   * @param cid
   * @param destination optional
   */
  public copyFile(
    cid: string,
    destination?: string,
  ): ResultAsync<void, IPFSUnavailableError> {
    if (this.initializeResult == null || this.httpClient == null) {
      throw new IPFSUnavailableError("Must call IPFSUtils.initialize() first");
    }
    const fromPath = `/ipfs/${cid}`;
    let toPath = destination || cid;

    if (toPath.charAt(0) !== "/") {
      toPath = "/" + toPath;
    }

    return ResultAsync.fromPromise(
      this.httpClient.files.cp(fromPath, toPath),
      (e) => {
        this.logUtils.error(e);
        throw new IPFSUnavailableError("Failure during copying file in IPFS");
      },
    );
  }
}
