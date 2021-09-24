import { PersistenceError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStorageUtils {
  write<T>(keyName: string, data: T): ResultAsync<void, PersistenceError>;
  read<T>(keyName: string): ResultAsync<T | null, PersistenceError>;
  remove(keyName: string): ResultAsync<void, PersistenceError>;
}

export const IStorageUtilsType = Symbol.for("IStorageUtils");
