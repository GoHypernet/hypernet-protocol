import { ethers } from "ethers";
import { ExternalProvider } from "./objects";

export class ExternalProviderUtils {
  getExternalProviderForDevelopment(): ExternalProvider {
    const externaJsonRpcProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    const wallet = ethers.Wallet.fromMnemonic(
      "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
    );
    const owner = wallet.connect(externaJsonRpcProvider);
    const externalProvider = new ExternalProvider(externaJsonRpcProvider, owner.address);
    return externalProvider;
  }
}
