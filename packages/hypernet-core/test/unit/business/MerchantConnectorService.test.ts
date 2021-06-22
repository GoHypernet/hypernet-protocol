import { MerchantUrl } from "@hypernetlabs/objects";
import { MerchantConnectorService } from "@implementations/business/MerchantConnectorService";
import { IMerchantConnectorService } from "@interfaces/business/IMerchantConnectorService";
import {
  IAccountsRepository,
  IMerchantConnectorRepository,
} from "@interfaces/data";
import { ok, okAsync } from "neverthrow";
import { ILogUtils } from "@hypernetlabs/utils";
import td from "testdouble";

import { ConfigProviderMock, ContextProviderMock } from "@tests/mock/utils";

class MerchantConnectorServiceMocks {
  public merchantConnectorRepository = td.object<IMerchantConnectorRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public contextProvider = new ContextProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public merchantUrl = MerchantUrl("http://localhost:5010");

  constructor() {
    td.when(
      this.merchantConnectorRepository.deauthorizeMerchant(this.merchantUrl),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.merchantConnectorRepository.destroyProxy(this.merchantUrl),
    ).thenReturn(undefined);
  }

  public factoryMerchantConnectorService(): IMerchantConnectorService {
    return new MerchantConnectorService(
      this.merchantConnectorRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.logUtils,
    );
  }
}

describe("MerchantConnectorService tests", () => {
  test("Should deauthorizeMerchant works without errors and without having the need to run the timeout method", async () => {
    // Arrange
    const merchantConnectorServiceMock = new MerchantConnectorServiceMocks();

    const merchantConnectorService = merchantConnectorServiceMock.factoryMerchantConnectorService();

    // Act
    const response = await merchantConnectorService.deauthorizeMerchant(
      merchantConnectorServiceMock.merchantUrl,
    );

    // Indicator for the deauthorization timeout method
    const destroyProxyCallingcount = td.explain(
      merchantConnectorServiceMock.merchantConnectorRepository.destroyProxy,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(destroyProxyCallingcount).toBe(0);
    expect(response._unsafeUnwrap()).toBe(undefined);
  });

  test("Should deauthorizeMerchant runs the timeout method if deauthorizeMerchant repository lasted more than deauthorizationTimeout", async () => {
    // Arrange
    const merchantConnectorServiceMock = new MerchantConnectorServiceMocks();

    const merchantConnectorService = merchantConnectorServiceMock.factoryMerchantConnectorService();

    td.when(
      merchantConnectorServiceMock.merchantConnectorRepository.deauthorizeMerchant(
        merchantConnectorServiceMock.merchantUrl,
      ),
    ).thenReturn(
      new Promise((resolve, reject) =>
        setTimeout(() => resolve(ok(undefined)), 7000),
      ),
    );

    // Act
    const response = await merchantConnectorService.deauthorizeMerchant(
      merchantConnectorServiceMock.merchantUrl,
    );

    // Indicator for the deauthorization timeout method
    const destroyProxyCallingcount = td.explain(
      merchantConnectorServiceMock.merchantConnectorRepository.destroyProxy,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(destroyProxyCallingcount).toBe(1);
    expect(response._unsafeUnwrap()).toBe(undefined);
  }, 10000);
});
