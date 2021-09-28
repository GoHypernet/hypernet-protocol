import { TileDocument } from "@ceramicnetwork/stream-tile";
import { PersistenceError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicUtils {
  initialize(): ResultAsync<void, PersistenceError>;
  initiateDefinitions(): ResultAsync<TileDocument[], PersistenceError>;
  writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<void, PersistenceError>;
  readRecord<T>(aliasName: string): ResultAsync<T | null, PersistenceError>;
  removeRecord(aliasName: string): ResultAsync<void, PersistenceError>;
}

export interface ISchemaWithName {
  name: string;
  schema: TileDocument;
}

export interface IRecordWithDataKey<T> {
  data: T;
}

export const ICeramicUtilsType = Symbol.for("ICeramicUtils");
