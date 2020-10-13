import Web3 from "web3";
import { provider } from "web3-core";

export interface IWeb3Provider {
  getWeb3(): Promise<Web3>;
  getProvider(): Promise<provider>;
}
