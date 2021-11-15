import { PersistenceError, VectorError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStorageUtils {
  write<T>(
    keyName: string,
    data: T,
  ): ResultAsync<void, PersistenceError | VectorError>;
  read<T>(
    keyName: string,
  ): ResultAsync<T | null, PersistenceError | VectorError>;
  remove(keyName: string): ResultAsync<void, PersistenceError | VectorError>;
}

export const IStorageUtilsType = Symbol.for("IStorageUtils");
