/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CeramicClient from "@ceramicnetwork/http-client";
import { DIDDataStore } from "@glazed/did-datastore";
import {
  PersistenceError,
  BlockchainUnavailableError,
  VectorError,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  ILogUtils,
  ILogUtilsType,
  CryptoUtils,
} from "@hypernetlabs/utils";
import { Resolver } from "did-resolver";
import { DID } from "dids";
import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ICeramicUtils,
  IConfigProvider,
  IContextProvider,
  IRecordWithDataKey,
  IBrowserNodeProvider,
  IConfigProviderType,
  IContextProviderType,
  IBrowserNodeProviderType,
} from "@interfaces/utilities";

@injectable()
export class CeramicUtils implements ICeramicUtils {
  protected ceramic: CeramicClient | null = null;
  protected didAuthProvider: Ed25519Provider | null = null;
  protected didResolver: Resolver | null = null;
  protected didDataStore: DIDDataStore | null = null;
  protected initializeResult: ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > | null = null;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(
    accountAddress?: EthereumAccountAddress,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      this.initializeResult = this._authenticateUser(accountAddress);
    }

    return this.initializeResult;
  }

  public writeRecord<T>(
    key: string,
    content: T,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
      if (this.didDataStore == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.didDataStore.set(key, { data: content }),
        (e) => new PersistenceError("didDataStore.set failed", e),
      ).map(() => {});
    });
  }

  public readRecord<T>(
    key: string,
  ): ResultAsync<
    T | null,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
      if (this.didDataStore == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.didDataStore.get(key) as Promise<IRecordWithDataKey<T>>,
        (e) => new PersistenceError("idx.get failed", e),
      ).map((record) => {
        return record?.data || null;
      });
    });
  }

  public removeRecord(
    key: string,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      throw new Error("Must call CeramicUtils.initialize() first");
    }
    return this.initializeResult.andThen(() => {
      if (this.didDataStore == null) {
        throw new Error("Something went wrong while initializing Ceramic!");
      }

      return ResultAsync.fromPromise(
        this.didDataStore.remove(key),
        (e) => new PersistenceError("idx.remove failed", e),
      );
    });
  }

  private _authenticateUser(
    accountAddress?: EthereumAccountAddress,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    this.logUtils.debug(`Authenticating user with Ceramic`);
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      accountAddress
        ? okAsync(CryptoUtils.randomBytes(32, accountAddress))
        : this.getProviderSeed(),
    ]).andThen((vals) => {
      const [config, context, seed] = vals;

      if (context.account == null) {
        throw new Error(
          "Must have established account before trying to setup Ceramic!",
        );
      }

      this.logUtils.debug(
        `Setting up Ceramic client for account ${context.account}`,
      );

      // Create the CeramicClient
      this.ceramic = new CeramicClient(config.ceramicNodeUrl);

      // Create a KeyDID provider
      this.didAuthProvider = new Ed25519Provider(seed);

      // Set DID instance on the client
      this.ceramic.did = new DID({
        provider: this.didAuthProvider,
        resolver: KeyDidResolver.getResolver(),
      });

      this.logUtils.debug(`Starting Ceramic authentication`);
      context.onCeramicAuthenticationStarted.next();
      return ResultAsync.fromPromise(this.ceramic.did.authenticate(), (e) => {
        return new PersistenceError("Could not authenticate with Ceramic", e);
      })
        .andThen(() => {
          this.logUtils.info(
            `ceramic logged in, ceramic did id: ${this.ceramic?.did?.id.toString()}`,
          );
          context.onCeramicAuthenticationSucceeded.next();

          this.didDataStore = new DIDDataStore({
            ceramic: this.ceramic!,
            model: config.ceramicDataModel,
          });

          return okAsync(undefined);
        })
        .mapErr((e) => {
          const error = new PersistenceError(
            "Storage authentication failed",
            e,
          );
          context.onCeramicFailed.next(error);
          return new PersistenceError("Storage authentication failed", e);
        });
    });
  }

  private getProviderSeed(): ResultAsync<
    Uint8Array,
    VectorError | BlockchainUnavailableError
  > {
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        // We will sign a utility message with the browser node to get a fixed key signature
        return browserNode.signUtilityMessage("Hypernet Protocol Persistence");
      })
      .map((signature) => {
        return CryptoUtils.randomBytes(32, signature);
      });
  }
}
