import { ILogUtils } from "@hypernetlabs/utils";
import { HypernetConfig } from "@interfaces/objects";
import td from "testdouble";

import { ConfigProvider } from "@implementations/utilities";
import { IConfigProvider } from "@interfaces/utilities";

class ConfigProviderMocks {
  public logUtils = td.object<ILogUtils>();
  constructor() {}

  public factoryConfigProvider(): IConfigProvider {
    return new ConfigProvider(this.logUtils);
  }
}

describe("ConfigProvider tests", () => {
  test("getConfig should return config", async () => {
    // Arrange
    const configProviderMocks = new ConfigProviderMocks();
    const configProvider = configProviderMocks.factoryConfigProvider();

    // Act
    const result = await configProvider.getConfig();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeInstanceOf(HypernetConfig);
  });
});
