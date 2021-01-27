import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { HypernetConfig } from "@interfaces/objects/HypernetConfig";
import { getPublicIdentifierFromPublicKey } from "@connext/vector-utils/dist/identifiers";
import { getPublicKeyFromPrivateKey } from "@connext/vector-utils/dist/crypto";
import { Wallet, constants } from "ethers";
import { EBlockchainNetwork } from "@interfaces/types";
import { ResultAsync } from "@interfaces/objects";
import { okAsync } from "neverthrow";
import { ILogUtils } from "@interfaces/utilities";
import { ChainProviders } from "@connext/vector-types";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(network: EBlockchainNetwork, protected logUtils: ILogUtils, config?: HypernetConfig) {
    if (config != null) {
      this.config = config;
      return;
    }

    if (network === EBlockchainNetwork.Localhost) {
      const chainProvider: ChainProviders = {
        [1337]: "http://localhost:8545",
      };

      this.config = new HypernetConfig(
        "http://localhost:5000", // iframeSource
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", // Router mnemonic
        "", // routerPublicIdentifier
        1337, // Chain ID
        "localhost:8008", // Router address
        constants.AddressZero, // Hypertoken address,
        "Hypernet", // Hypernet Protocol Domain for Transfers
        5 * 24 * 60 * 60, // 5 days as the default payment expiration time
        chainProvider,
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = getPublicIdentifierFromPublicKey(
        getPublicKeyFromPrivateKey(wallet.privateKey),
      );

      this.logUtils.log("Wallet private key", wallet.privateKey);
      this.logUtils.log("Router publicIdentifier", this.config.routerPublicIdentifier);
    } else {
      // Should be MainNet config here
      const chainProvider: ChainProviders = {
        [1]: "https://mainnet.infura.io/v3/df03ad3247a4474fbdd864a276ba2478",
      };

      this.config = new HypernetConfig(
        "http://localhost:5000", // iframeSource
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", // Router mnemonic
        "", // routerPublicIdentifier
        1, // Chain ID
        "localhost:8008", // Router address
        constants.AddressZero, // Hypertoken address,
        "Hypernet", // Hypernet Protocol Domain for Transfers
        5 * 24 * 60 * 60, // 5 days as the default payment expiration time
        chainProvider,
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = getPublicIdentifierFromPublicKey(
        getPublicKeyFromPrivateKey(wallet.privateKey),
      );
    }
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
