import Web3 from "web3";

export interface IWeb3Provider {
  getWeb3(): Promise<Web3>;
}
