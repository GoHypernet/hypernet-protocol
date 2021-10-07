import {
  AuthorizedGatewaysSchema,
  DefinitionName,
  EthereumAddress,
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
        "infuraId",
        chainId,
        [ProviderUrl("governanceProviderUrl")],
        "hypernetProtocolDomain",
        defaultExpirationLength,
        {
          [chainId]: "http://localhost:8545",
        },
        {
          [chainId]: {
            channelFactoryAddress,
            transferRegistryAddress,
            hypertokenAddress: hyperTokenAddress,
            messageTransferAddress,
            insuranceTransferAddress,
            parameterizedTransferAddress,
            gatewayRegistryAddress,
            liquidityRegistryAddress,
            hypernetGovernorAddress,
            registryFactoryAddress,
          },
        },
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
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
