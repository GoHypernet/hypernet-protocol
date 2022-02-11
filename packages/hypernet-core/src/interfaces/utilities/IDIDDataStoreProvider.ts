import {
  BlockchainUnavailableError,
  EthereumAccountAddress,
  PersistenceError,
  VectorError,
} from "@hypernetlabs/objects";
import { DIDDataStore } from "@glazed/did-datastore";
import { ResultAsync } from "neverthrow";

export interface IDIDDataStoreProvider {
  initializeDIDDataStoreProvider(
    accountAddress?: EthereumAccountAddress,
  ): ResultAsync<
    DIDDataStore,
    PersistenceError | VectorError | BlockchainUnavailableError
  >;
}

export const IDIDDataStoreProviderType = Symbol.for("IDIDDataStoreProvider");
