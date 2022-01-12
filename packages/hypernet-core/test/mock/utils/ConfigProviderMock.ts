import {
  AuthorizedGatewaysSchema,
  ChainId,
  ChainInformation,
  LazyMintingSignatureSchema,
} from "@hypernetlabs/objects";
import { HypernetConfig } from "@interfaces/objects";
import {
  chainId,
  defaultExpirationLength,
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
        "iframeSource", // iframeSource
        chainId, // governanceChainId
        new Map<ChainId, ChainInformation>([
          [chainId, governanceChainInformation],
        ]), // chainInformation
        governanceChainInformation, // governanceChainInformation
        "hypernetProtocolDomain", // hypernetProtocolDomain
        defaultExpirationLength, // defaultPaymentExpiryLength
        "natsUrl", // natsUrl
        "authUrl", // authUrl
        "gatewayIframeUrl", // gatewayIframeUrl
        "https://clay.ceramic.hypernet.foundation", // ceramicNodeUrl
        {
          definitions: {
            [AuthorizedGatewaysSchema.title]:
              "kjzl6cwe1jw148xm690vbhrn5fwiiqjm4kmvnb8jzhktzdh3tcztzwuxoi8hl5n",
            [LazyMintingSignatureSchema.title]:
              "kjzl6cwe1jw145oxq649aslc8hk4zzz52yvyy7rugfx0qme25ksfzq3l93rdea5",
          },
          schemas: {
            [AuthorizedGatewaysSchema.title]:
              "ceramic://k3y52l7qbv1frycmgeghbfxd4qqh718tp4s2fd7wnmz5vhy7f3lvhcvl1w2lggglc",
            [LazyMintingSignatureSchema.title]:
              "ceramic://k3y52l7qbv1fryju2t19l5gbemvmtuk6mzpfpyamyy1g45mad0b6yukp38gdxmdj4",
          },
          tiles: {},
        }, // ceramicDataModel
        5 * 1000, // gatewayDeauthorizationTimeout
        "HypernetProtocolControlClaims", // controlClaimSubject
        false, // requireOnline
        true,
        true,
        "ipfsApiUrl",
        "ipfsGatewayUrl",
        false, // debug is off for testing
      );
  }

  getConfig(): ResultAsync<HypernetConfig, never> {
    return okAsync(this.config);
  }
}
