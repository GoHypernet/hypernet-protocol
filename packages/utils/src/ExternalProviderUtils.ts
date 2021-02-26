import { ethers } from "ethers";
import { ExternalProvider } from "./objects";

export class ExternalProviderUtils {
  getExternalProviderForDevelopment(): ExternalProvider {
    const externalWeb3Provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const wallet = ethers.Wallet.fromMnemonic(
      "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
    );
    const owner = wallet.connect(externalWeb3Provider);
    const externalProvider = new ExternalProvider(externalWeb3Provider, owner.address);
    return externalProvider;
  }
}