import { PersistenceError } from "@hypernetlabs/objects";
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
      if (false) { // context.metamaskEnabled) {
        this.ceramicUtils.writeRecord(keyName, data).mapErr((err) => {
          this.logUtils.error(err);
        });
        // TODO: More advanced ceramic error handling
      }
      return okAsync(undefined);
    });
  }

  public read<T>(keyName: string): ResultAsync<T | null, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      if (false) {
        return this.ceramicUtils.readRecord(keyName);
      } else {
        const data = this.localStorageUtils.getItem(keyName);
        if (data == null) {
          return okAsync(null);
        }
        return okAsync(JSON.parse(data));
      }
    });
  }

  public remove(keyName: string): ResultAsync<void, PersistenceError> {
    return this.contextProvider.getContext().andThen((context) => {
      if (false) {
        return this.ceramicUtils.removeRecord(keyName);
      } else {
        this.localStorageUtils.removeItem(keyName);
        return okAsync(undefined);
      }
    });
  }
}
