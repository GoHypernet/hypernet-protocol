import { ResultAsync } from "neverthrow";

export interface IStorageUtils {
  write<T>(keyName: string, data: T): ResultAsync<void, never>;
  read<T>(keyName: string): ResultAsync<T | null, never>;
  remove(keyName: string): ResultAsync<void, never>;
}

export const IStorageUtilsType = Symbol.for("IStorageUtils");
