import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IInternalProvider {
  getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never>;
  getAddress(): ResultAsync<EthereumAccountAddress, never>;
}
