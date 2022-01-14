import { DIDDataStore } from "@glazed/did-datastore";
import {
  PersistenceError,
  BlockchainUnavailableError,
  VectorError,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ICeramicUtils,
  IContextProvider,
  IRecordWithDataKey,
  IContextProviderType,
  IDIDDataStoreProvider,
  IDIDDataStoreProviderType,
} from "@interfaces/utilities";

@injectable()
export class CeramicUtils implements ICeramicUtils {
  protected didDataStore: DIDDataStore | null = null;
  protected initializeResult: ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > | null = null;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IDIDDataStoreProviderType)
    protected didDataStoreProvider: IDIDDataStoreProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    if (this.initializeResult == null) {
      this.initializeResult = this._authenticateUser();
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

  private _authenticateUser(): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      if (context.account == null) {
        throw new Error(
          "Must have established account before trying to setup Ceramic!",
        );
      }

      this.logUtils.debug(
        `Setting up Ceramic client for account ${context.account}`,
      );

      context.onCeramicAuthenticationStarted.next();
      return this.didDataStoreProvider
        .initializeDIDDataStoreProvider()
        .andThen((didDataStore) => {
          context.onCeramicAuthenticationSucceeded.next();

          this.didDataStore = didDataStore;

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
}
