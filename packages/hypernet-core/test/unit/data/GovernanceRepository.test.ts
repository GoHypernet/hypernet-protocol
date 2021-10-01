import {
  Signature,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayRegistrationInfo,
  ProxyError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { GovernanceRepository } from "@implementations/data/GovernanceRepository";
import { IGovernanceRepository } from "@interfaces/data/IGovernanceRepository";
import { BlockchainProviderMock, ConfigProviderMock } from "@mock/utils";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

class GovernanceRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    /* td.when(this.gatewayConnectorProxy.activateProxy()).thenReturn(
      okAsync(undefined),
    ); */
  }

  public factoryRepository(): IGovernanceRepository {
    return new GovernanceRepository(
      this.blockchainProvider,
      this.configProvider,
      this.logUtils,
    );
  }
}

describe("GovernanceRepository tests", () => {
  test("should getProposals return list of proposals", async () => {
    // Arrange
    const mocks = new GovernanceRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getProposals([1]);
    console.log("result: ", result);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });
});
