import { TileDocument } from "@ceramicnetwork/stream-tile";
import { PersistenceError, VectorError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicUtils {
  initialize(): ResultAsync<void, PersistenceError | VectorError>;
  initiateDefinitions(): ResultAsync<
    TileDocument[],
    PersistenceError | VectorError
  >;
  writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<void, PersistenceError | VectorError>;
  readRecord<T>(
    aliasName: string,
  ): ResultAsync<T | null, PersistenceError | VectorError>;
  removeRecord(
    aliasName: string,
  ): ResultAsync<void, PersistenceError | VectorError>;
}

export interface ISchemaWithName {
  name: string;
  schema: TileDocument;
}

export interface IRecordWithDataKey<T> {
  data: T;
}

export const ICeramicUtilsType = Symbol.for("ICeramicUtils");
