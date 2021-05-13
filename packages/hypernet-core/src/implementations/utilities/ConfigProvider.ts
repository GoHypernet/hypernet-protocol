import {
  ChainAddresses,
  ChainProviders,
  ContractAddresses,
} from "@connext/vector-types";
import { getPublicKeyFromPrivateKey } from "@connext/vector-utils/dist/crypto";
import { getPublicIdentifierFromPublicKey } from "@connext/vector-utils/dist/identifiers";
import {
  EthereumAddress,
  HypernetConfig,
  PublicIdentifier,
  EBlockchainNetwork,
  AuthorizedMerchantsSchema,
  DefinitionName,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { Wallet, constants } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";

export class ConfigProvider implements IConfigProvider {
  protected config: HypernetConfig;

  constructor(
    network: EBlockchainNetwork,
    protected logUtils: ILogUtils,
    config?: HypernetConfig,
  ) {
    if (config != null) {
      this.config = config;
      return;
    }

    if (network === EBlockchainNetwork.Localhost) {
      const chainProvider: ChainProviders = {
        [1337]: "http://localhost:8545",
      };

      const contractAddresses: ContractAddresses = {
        channelFactoryAddress: "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
        transferRegistryAddress: "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F",
      };

      const chainAddresses: ChainAddresses = {
        [1337]: contractAddresses,
      };

      this.config = new HypernetConfig(
        "http://localhost:5000", // iframeSource
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", // Router mnemonic
        PublicIdentifier(""), // routerPublicIdentifier
        1337, // Chain ID
        "localhost:8008", // Router address
        EthereumAddress(constants.AddressZero), // Hypertoken address,
        "Hypernet", // Hypernet Protocol Domain for Transfers
        5 * 24 * 60 * 60, // 5 days as the default payment expiration time
        chainProvider,
        "hypernetProtocolSpace",
        "openThreadKey",
        chainAddresses,
        "http://localhost:5005", // merchantIframeUrl
        "https://ceramic-clay.3boxlabs.com", // ceramicNodeUrl,
        new Map([
          [
            DefinitionName(AuthorizedMerchantsSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]),
        true, // debug
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = PublicIdentifier(
        getPublicIdentifierFromPublicKey(
          getPublicKeyFromPrivateKey(wallet.privateKey),
        ),
      );

      this.logUtils.log("Wallet private key", wallet.privateKey);
      this.logUtils.log(
        "Router publicIdentifier",
        this.config.routerPublicIdentifier,
      );
    } else {
      // Should be MainNet config here
      const chainProvider: ChainProviders = {
        [1]: "https://mainnet.infura.io/v3/df03ad3247a4474fbdd864a276ba2478",
      };

      // @todo fix later
      const contractAddresses: ContractAddresses = {
        transferRegistryAddress: "",
        channelFactoryAddress: "",
      };

      const chainAddresses: ChainAddresses = {
        [1]: contractAddresses,
      };

      this.config = new HypernetConfig(
        "http://localhost:5000", // iframeSource
        "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat", // Router mnemonic
        PublicIdentifier(""), // routerPublicIdentifier
        1, // Chain ID
        "localhost:8008", // Router address
        EthereumAddress(constants.AddressZero), // Hypertoken address,
        "Hypernet", // Hypernet Protocol Domain for Transfers
        5 * 24 * 60 * 60, // 5 days as the default payment expiration time
        chainProvider,
        "hypernetProtocolSpace",
        "openThreadKey",
        chainAddresses,
        "http://localhost:5005", // merchantIframeUrl
        "https://ceramic-clay.3boxlabs.com", // ceramicNodeUrl
        new Map([
          [
            DefinitionName(AuthorizedMerchantsSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]),
        true, // debug
      );

      const wallet = Wallet.fromMnemonic(this.config.routerMnemonic);
      this.config.routerPublicIdentifier = PublicIdentifier(
        getPublicIdentifierFromPublicKey(
          getPublicKeyFromPrivateKey(wallet.privateKey),
        ),
      );
    }
  }

  public getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
