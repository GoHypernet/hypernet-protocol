import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { ethers } from "ethers";

export interface IWeb3Provider {
  getWeb3Provider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    BlockchainUnavailableError
  >;
  getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError>;
}
