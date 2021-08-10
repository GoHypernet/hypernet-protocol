import td from "testdouble";
import { ILogUtils } from "@hypernetlabs/utils";
import { IConfigProvider } from "@interfaces/utilities";
import { ConfigProvider } from "@implementations/utilities";
import { HypernetConfig } from "@interfaces/objects";

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
    console.log(result);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeInstanceOf(HypernetConfig);
  });
});
