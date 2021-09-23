import { ResultAsync } from "neverthrow";

export interface IBlockchainListener {
  initialize(): ResultAsync<void, never>;
}
