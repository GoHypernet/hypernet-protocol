import {
  Signature,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayRegistrationInfo,
  ProxyError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { CeramicUtils } from "@implementations/utilities/CeramicUtils";
import { ICeramicUtils } from "@interfaces/utilities/ICeramicUtils";
import {
  BlockchainProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  BrowserNodeProviderMock,
} from "@mock/utils";

import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

class CeramicUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public contextProviderMock = new ContextProviderMock();
  public browserNodeProviderMock = new BrowserNodeProviderMock();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    /* td.when(this.gatewayConnectorProxy.activateProxy()).thenReturn(
      okAsync(undefined),
    ); */
  }

  public factoryRepository(): ICeramicUtils {
    return new CeramicUtils(
      this.configProvider,
      this.contextProviderMock,
      this.browserNodeProviderMock,
      this.logUtils,
    );
  }
}

describe("CeramicUtils tests", () => {
  test("should initialize works without errors", async () => {
    // Arrange
    const mocks = new CeramicUtilsMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.initialize();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });
});
