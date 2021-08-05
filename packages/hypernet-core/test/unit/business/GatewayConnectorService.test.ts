import { GatewayUrl } from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import {
  IAccountsRepository,
  IGatewayConnectorRepository,
} from "@interfaces/data";
import { ok, okAsync } from "neverthrow";
import td from "testdouble";

import { GatewayConnectorService } from "@implementations/business/GatewayConnectorService";
import { IGatewayConnectorService } from "@interfaces/business/IGatewayConnectorService";
import { ConfigProviderMock, ContextProviderMock } from "@tests/mock/utils";

class GatewayConnectorServiceMocks {
  public gatewayConnectorRepository = td.object<IGatewayConnectorRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public contextProvider = new ContextProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");

  constructor() {
    td.when(
      this.gatewayConnectorRepository.deauthorizeGateway(this.gatewayUrl),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.gatewayConnectorRepository.destroyProxy(this.gatewayUrl),
    ).thenReturn(undefined);
  }

  public factoryGatewayConnectorService(): IGatewayConnectorService {
    return new GatewayConnectorService(
      this.gatewayConnectorRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.logUtils,
    );
  }
}

describe("GatewayConnectorService tests", () => {
  test("Should deauthorizeGateway works without errors and without having the need to run the timeout method", async () => {
    // Arrange
    const gatewayConnectorServiceMock = new GatewayConnectorServiceMocks();

    const gatewayConnectorService =
      gatewayConnectorServiceMock.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.deauthorizeGateway(
      gatewayConnectorServiceMock.gatewayUrl,
    );

    // Indicator for the deauthorization timeout method
    const destroyProxyCallingcount = td.explain(
      gatewayConnectorServiceMock.gatewayConnectorRepository.destroyProxy,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(destroyProxyCallingcount).toBe(0);
    expect(response._unsafeUnwrap()).toBe(undefined);
  });

  test("Should deauthorizeGateway runs the timeout method if deauthorizeGateway repository lasted more than deauthorizationTimeout", async () => {
    // Arrange
    const gatewayConnectorServiceMock = new GatewayConnectorServiceMocks();

    const gatewayConnectorService =
      gatewayConnectorServiceMock.factoryGatewayConnectorService();

    td.when(
      gatewayConnectorServiceMock.gatewayConnectorRepository.deauthorizeGateway(
        gatewayConnectorServiceMock.gatewayUrl,
      ),
    ).thenReturn(
      new Promise((resolve, reject) =>
        setTimeout(() => resolve(ok(undefined)), 7000),
      ),
    );

    // Act
    const response = await gatewayConnectorService.deauthorizeGateway(
      gatewayConnectorServiceMock.gatewayUrl,
    );

    // Indicator for the deauthorization timeout method
    const destroyProxyCallingcount = td.explain(
      gatewayConnectorServiceMock.gatewayConnectorRepository.destroyProxy,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(destroyProxyCallingcount).toBe(0);
    expect(response._unsafeUnwrap()).toBe(undefined);
  }, 10000);
});
