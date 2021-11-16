import {
  BlockchainUnavailableError,
  PersistenceError,
  VectorError,
} from "@hypernetlabs/objects";
import {
  ILogUtils,
  ILogUtilsType,
  ILocalStorageUtils,
  ILocalStorageUtilsType,
  ResultUtils,
} from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync, errAsync } from "neverthrow";

import { IStorageUtils } from "@interfaces/data/utilities";
import {
  IContextProvider,
  IContextProviderType,
  ICeramicUtils,
  ICeramicUtilsType,
} from "@interfaces/utilities";

@injectable()
export class StorageUtils implements IStorageUtils {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ICeramicUtilsType) protected ceramicUtils: ICeramicUtils,
    @inject(ILocalStorageUtilsType)
    protected localStorageUtils: ILocalStorageUtils,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {}

  public write<T>(
    keyName: string,
    data: T,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.race([
      this._writeSessionStorage(keyName, data),
      ResultUtils.backoffAndRetry(
        () => {
          return this.ceramicUtils.writeRecord(keyName, data).orElse((err) => {
            return this.contextProvider.getContext().andThen((context) => {
              this.logUtils.error(err);
              context.onCeramicFailed.next(err);
              return errAsync(err);
            });
          });
        },
        [PersistenceError],
        2,
      ),
    ]);
  }

  public read<T>(
    keyName: string,
  ): ResultAsync<
    T | null,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    // Read from session storage first.
    this.logUtils.debug(`Reading value for key ${keyName}`);
    return this._readSessionStorage<T>(keyName)
      .andThen((val) => {
        // If the value is there, then we're good.
        if (val != null) {
          return okAsync<T | null, PersistenceError>(val);
        }

        // The value is not in SessionStorage, so we need to get it from Ceramic
        this.logUtils.debug(
          `Key not found in session storage, reading value for key ${keyName} from Ceramic`,
        );

        return ResultUtils.backoffAndRetry(
          () => this.ceramicUtils.readRecord<T>(keyName),
          [PersistenceError],
          2,
        ).andThen((ceramicVal) => {
          if (ceramicVal == null) {
            // It's really null!
            return okAsync<T | null, PersistenceError>(ceramicVal);
          }
          // Need to update session storage before we return a value.
          return this._writeSessionStorage(keyName, ceramicVal).map(() => {
            return ceramicVal;
          });
        });
      })
      .orElse((err) => {
        return this.contextProvider.getContext().andThen((context) => {
          this.logUtils.error(err);
          context.onCeramicFailed.next(err);
          return errAsync(err);
        });
      });
  }

  public remove(
    keyName: string,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.race([
      this._removeSessionStorage(keyName),
      ResultUtils.backoffAndRetry(
        () =>
          this.ceramicUtils.removeRecord(keyName).orElse((err) => {
            return this.contextProvider.getContext().andThen((context) => {
              this.logUtils.error(err);
              context.onCeramicFailed.next(err);
              return errAsync(err);
            });
          }),
        [PersistenceError],
        2,
      ),
    ]).map(() => {});
  }

  private _writeSessionStorage<T>(
    keyName: string,
    data: T,
  ): ResultAsync<void, never> {
    this.localStorageUtils.setSessionItem(keyName, JSON.stringify(data));
    return okAsync(undefined);
  }

  private _readSessionStorage<T>(
    keyName: string,
  ): ResultAsync<T | null, never> {
    const data = this.localStorageUtils.getSessionItem(keyName);
    if (data == null) {
      return okAsync(null);
    }
    return okAsync(JSON.parse(data) as T);
  }

  private _removeSessionStorage(keyName: string): ResultAsync<void, never> {
    this.localStorageUtils.removeSessionItem(keyName);
    return okAsync(undefined);
  }
}
