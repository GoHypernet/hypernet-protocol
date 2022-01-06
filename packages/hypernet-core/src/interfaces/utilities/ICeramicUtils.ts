import {
  BlockchainUnavailableError,
  PersistenceError,
  VectorError,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicUtils {
  initialize(
    accountAddress?: EthereumAccountAddress,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  readRecord<T>(
    aliasName: string,
  ): ResultAsync<
    T | null,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  removeRecord(
    aliasName: string,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
}

export interface IRecordWithDataKey<T> {
  data: T;
}

export const ICeramicUtilsType = Symbol.for("ICeramicUtils");
