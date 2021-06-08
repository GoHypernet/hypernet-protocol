import {
  ILogUtils,
  ILogUtilsType,
  ILocalStorageUtils,
  ILocalStorageUtilsType,
} from "@hypernetlabs/utils";
import { inject, injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

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

  public write<T>(keyName: string, data: T): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      this.localStorageUtils.setItem(keyName, JSON.stringify(data));
      if (false) {
        // context.metamaskEnabled) {
        this.ceramicUtils.writeRecord(keyName, data).mapErr((err) => {
          this.logUtils.error(err);
          context.onCeramicFailed.next(err);
        });
      }

      return this._writeLocalStorage(keyName, data);
    });
  }

  public read<T>(keyName: string): ResultAsync<T | null, never> {
    return this.contextProvider.getContext().andThen((context) => {
      //if (context.metamaskEnabled) {
      if (false) {
        return this.ceramicUtils.readRecord<T>(keyName).orElse((err) => {
          this.logUtils.error(err);
          context.onCeramicFailed.next(err);
          return this._readLocalStorage<T>(keyName);
        });
      } else {
        return this._readLocalStorage<T>(keyName);
      }
    });
  }

  public remove(keyName: string): ResultAsync<void, never> {
    return this.contextProvider.getContext().andThen((context) => {
      //if (context.metamaskEnabled) {
      if (false) {
        this.ceramicUtils.removeRecord(keyName).mapErr((err) => {
          this.logUtils.error(err);
          context.onCeramicFailed.next(err);
        });
      }
      return this._removeLocalStorage(keyName);
    });
  }

  private _writeLocalStorage(
    keyName: string,
    data: any,
  ): ResultAsync<void, never> {
    this.localStorageUtils.setItem(keyName, JSON.stringify(data));
    return okAsync(undefined);
  }

  private _readLocalStorage<T>(keyName: string): ResultAsync<T | null, never> {
    const data = this.localStorageUtils.getItem(keyName);
    if (data == null) {
      return okAsync(null);
    }
    return okAsync(JSON.parse(data) as T);
  }

  private _removeLocalStorage(keyName: string): ResultAsync<void, never> {
    this.localStorageUtils.removeItem(keyName);
    return okAsync(undefined);
  }
}
