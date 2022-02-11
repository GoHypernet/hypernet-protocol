import { ILogUtils } from "@hypernetlabs/utils";
import td from "testdouble";
import { DIDDataStore } from "@glazed/did-datastore";
import { okAsync } from "neverthrow";

import { CeramicUtils } from "@implementations/utilities/CeramicUtils";
import { ICeramicUtils } from "@interfaces/utilities/ICeramicUtils";
import {
  BlockchainProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  BrowserNodeProviderMock,
} from "@mock/utils";
import { IDIDDataStoreProvider } from "@interfaces/utilities";

class CeramicUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public contextProviderMock = new ContextProviderMock();
  public browserNodeProviderMock = new BrowserNodeProviderMock();
  public didDataStoreProvider = td.object<IDIDDataStoreProvider>();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    td.when(
      this.didDataStoreProvider.initializeDIDDataStoreProvider(),
    ).thenReturn(okAsync({} as DIDDataStore));
  }

  public factoryRepository(): ICeramicUtils {
    return new CeramicUtils(
      this.contextProviderMock,
      this.didDataStoreProvider,
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
