import {
  AuthorizedGatewaysSchema,
  ChainId,
  ChainInformation,
  DefinitionName,
  EthereumAddress,
  GovernanceChainInformation,
  ProviderUrl,
  SchemaUrl,
} from "@hypernetlabs/objects";
import { HypernetConfig } from "@interfaces/objects";
import {
  chainId,
  channelFactoryAddress,
  defaultExpirationLength,
  gatewayRegistryAddress,
  hyperTokenAddress,
  insuranceTransferAddress,
  liquidityRegistryAddress,
  messageTransferAddress,
  parameterizedTransferAddress,
  transferRegistryAddress,
  hypernetGovernorAddress,
  registryFactoryAddress,
  tokenRegistryAddress,
  chainRegistryAddress,
  governanceChainInformation,
} from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";

import { IConfigProvider } from "@interfaces/utilities";

export class ConfigProviderMock implements IConfigProvider {
  public config: HypernetConfig;

  constructor(config: HypernetConfig | null = null) {
    this.config =
      config ??
      new HypernetConfig(
        "iframeSource",
        chainId,
        new Map<ChainId, ChainInformation>([
          [chainId, governanceChainInformation],
        ]),
        governanceChainInformation,
        "hypernetProtocolDomain",
        defaultExpirationLength,
        "natsUrl",
        "authUrl",
        "gatewayIframeUrl",
        "https://ceramic-clay.3boxlabs.com",
        new Map([
          [
            DefinitionName(AuthorizedGatewaysSchema.title),
            SchemaUrl(
              "kjzl6cwe1jw148ngghzoumihdtadlx9rzodfjlq5tv01jzr7cin7jx3g3gtfxf3",
            ),
          ],
        ]), // storageAliases
        5 * 1000,
        "HypernetProtocolControlClaims", // controlClaimSubject
        false, // requireOnline
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
