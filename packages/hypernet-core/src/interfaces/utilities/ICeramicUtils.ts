import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  BlockchainUnavailableError,
  PersistenceError,
  VectorError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicUtils {
  initialize(): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
  initiateDefinitions(): ResultAsync<
    TileDocument[],
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

export interface ISchemaWithName {
  name: string;
  schema: TileDocument;
}

export interface IRecordWithDataKey<T> {
  data: T;
}

export const ICeramicUtilsType = Symbol.for("ICeramicUtils");
