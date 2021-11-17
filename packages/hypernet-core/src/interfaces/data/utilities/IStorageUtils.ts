import {
  BlockchainUnavailableError,
  PersistenceError,
  VectorError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IStorageUtils {
  write<T>(
    keyName: string,
    data: T,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  read<T>(
    keyName: string,
  ): ResultAsync<
    T | null,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  remove(
    keyName: string,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
}

export const IStorageUtilsType = Symbol.for("IStorageUtils");
