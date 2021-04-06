import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IInternalProvider extends ethers.providers.JsonRpcProvider {
  provider: ResultAsync<ethers.providers.JsonRpcProvider, never>;
  address: string;
}
