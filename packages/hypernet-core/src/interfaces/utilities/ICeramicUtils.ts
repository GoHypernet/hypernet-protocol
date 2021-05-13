import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ICeramicUtils {
  authenticateUser(): ResultAsync<
    void,
    CeramicError | BlockchainUnavailableError
  >;
  initiateDefinitions(): ResultAsync<
    TileDocument[],
    CeramicError | BlockchainUnavailableError
  >;
  writeRecord<T>(
    aliasName: string,
    content: T,
  ): ResultAsync<void, CeramicError>;
  readRecord<T>(aliasName: string): ResultAsync<T | null, CeramicError>;
  removeRecord(aliasName: string): ResultAsync<void, CeramicError>;
}

export interface ISchemaWithName {
  name: string;
  schema: TileDocument;
}

export interface IRecordWithDataKey<T> {
  data: T;
}
