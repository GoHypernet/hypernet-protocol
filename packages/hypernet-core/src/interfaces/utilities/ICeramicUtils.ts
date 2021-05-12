import { ResultAsync } from "neverthrow";
import type StreamID from "@ceramicnetwork/streamid";
import { TileDocument } from "@ceramicnetwork/stream-tile";

import {
  CeramicError,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";

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
  ): ResultAsync<StreamID, CeramicError>;
  readRecord<T>(aliasName: string): ResultAsync<T | null, CeramicError>;
  removeRecord(aliasName: string): ResultAsync<void, CeramicError>;
}
