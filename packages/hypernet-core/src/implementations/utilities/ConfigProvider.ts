import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";
import { getPublicIdentifierFromPublicKey } from "@connext/vector-utils/dist/identifiers";
import { getPublicKeyFromPrivateKey } from "@connext/vector-utils/dist/crypto";
import { Wallet } from "ethers";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(config?: HypernetConfig) {
    if (config == null) {


      this.config = new HypernetConfig(
        "http://localhost:3001", // auth URL
        "nats://localhost:4222", // nats URL
        {
          "1337": {
            "channelFactoryAddress": "0x084aeA04D0B333506e212B1e531cA223650bF284",
            "channelMastercopyAddress": "0x83e4293c7c5782630A57DD60eEbE36BF20EfDfcD",
            "transferRegistryAddress": "0xa227b9C3e0cE1f74029063a5b567D97BDed316e1"
          }
        }, // Chain addresses
        {
          "1337": "http://localhost:8545"
        }, // Chain providers
        "isolate income chaos sustain harsh suggest dawn kid sentence sad unable palace upper source below", // Router mnemonic
        "", // routerPublicIdentifier
        1337, // Chain ID
        "localhost:8008", // Router address
        "0x0000000000000000000000000000000000000000" // Hypertoken address
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = getPublicIdentifierFromPublicKey(
        getPublicKeyFromPrivateKey(wallet.privateKey));

      console.log("wallet private key", wallet.privateKey);
      console.log("routerPublicIdentifier", this.config.routerPublicIdentifier);
    }
    else {
      this.config = config;
    }
  }

  public async getConfig(): Promise<HypernetConfig> {
    return Promise.resolve(
      this.config
    );
  }
}


