import { IWeb3Provider } from "@interfaces/utilities/IWeb3Provider";
import Web3 from "web3";

declare global {
  interface Window {
    web3: Web3;
  }
}

export class Web3Provider implements IWeb3Provider {
  protected web3: Promise<Web3>;

  constructor() {
    this.web3 = Promise.resolve(window.web3);
  }

  /**
   * getWeb3
   * @return Web3
   */
  public async getWeb3(): Promise<Web3> {
    return this.web3;
  }
}
