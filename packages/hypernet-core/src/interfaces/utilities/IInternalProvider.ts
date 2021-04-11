import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { EthereumAddress } from "@hypernetlabs/objects";

export interface IInternalProvider {
  getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never>;
  getAddress(): ResultAsync<EthereumAddress, never>;
}
