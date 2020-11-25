import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";
import { getPublicIdentifierFromPublicKey } from "@connext/vector-utils/dist/identifiers";
import { getPublicKeyFromPrivateKey } from "@connext/vector-utils/dist/crypto";
import { Wallet, constants } from "ethers";
import { EBlockchainNetwork } from "@interfaces/types";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(network: EBlockchainNetwork, 
    config?: HypernetConfig) {
    if (config != null) {
      this.config = config;
      return;
    }

    if (network == EBlockchainNetwork.Localhost) {
      this.config = new HypernetConfig(
        "http://localhost:5000", // iframeSource
        "isolate income chaos sustain harsh suggest dawn kid sentence sad unable palace upper source below", // Router mnemonic
        "", // routerPublicIdentifier
        1337, // Chain ID
        "localhost:8008", // Router address
        constants.AddressZero, // Hypertoken address,
        "Hypernet", // Hypernet Protocol Domain for Transfers
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = getPublicIdentifierFromPublicKey(
        getPublicKeyFromPrivateKey(wallet.privateKey),
      );

      console.log("wallet private key", wallet.privateKey);
      console.log("routerPublicIdentifier", this.config.routerPublicIdentifier);
    }
  }

  public async getConfig(): Promise<HypernetConfig> {
    return Promise.resolve(this.config);
  }
}
