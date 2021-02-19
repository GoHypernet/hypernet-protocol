import { IHypernetCore, HypernetCore, EBlockchainNetwork, ExternalProvider } from "@hypernetlabs/hypernet-core";
import { Wallet, ethers } from "ethers";
import CoreWrapper from "./CoreWrapper";

declare global {
  interface Window {
    ethereum: any;
  }
}

let externalProvider: ExternalProvider;
if (true) {
  const externalWeb3Provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const wallet = ethers.Wallet.fromMnemonic(
    "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
  );
  const owner = wallet.connect(externalWeb3Provider);
  externalProvider = new ExternalProvider(externalWeb3Provider, owner.address);
}

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost, undefined, externalProvider);

const coreWrapper = new CoreWrapper(core);
coreWrapper.activateModel();
