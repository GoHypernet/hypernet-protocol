import { GatewayUrl, Signature, EthereumAddress } from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { GatewayService } from "@gateway-iframe/implementations/business";
import { ContextProvider } from "@gateway-iframe/implementations/utils";
import { IGatewayService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IGatewayConnectorRepository,
  IPersistenceRepository,
} from "@gateway-iframe/interfaces/data";
import { GatewayValidationError } from "@gateway-iframe/interfaces/objects/errors";

jest.mock("ethers", () => {
  return {
    ethers: {
      utils: {
        verifyMessage: () => {
          return "0x14791697260E4c9A71f18484C9f997B308e59325";
        },
      },
    },
  };
});

class GatewayServiceMocks {
  public gatewayConnectorRepository =
    td.object<IGatewayConnectorRepository>();
  public persistenceRepository = td.object<IPersistenceRepository>();
  public hypernetCoreRepository = td.object<IHypernetCoreRepository>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");
  public nowTime = 1487076708000;
  public signature = Signature(
    "0x236d12b38357dc30944bfe99ba9088f75b20caacb1f9166b680238f41968c02d44de2896897f116708a1317cec186a259166bf675a1fae85c85fcb5ec646ba5f1c",
  );
  public address = "0x14791697260E4c9A71f18484C9f997B308e59325";
  public gatewayCode = "some code";
  public contextProvider = new ContextProvider(this.gatewayUrl);

  constructor() {
    Date.now = jest.fn(() => this.nowTime);
  }

  public runSuccessScenarios() {
    td.when(
      this.gatewayConnectorRepository.getGatewaySignature(this.gatewayUrl),
    ).thenReturn(okAsync(Signature(this.signature)));
    td.when(
      this.gatewayConnectorRepository.getGatewayAddress(this.gatewayUrl),
    ).thenReturn(okAsync(EthereumAddress(this.address)));
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(this.gatewayUrl),
    ).thenReturn(okAsync(this.gatewayCode));
    td.when(
      this.persistenceRepository.addActivatedGatewaySignature(this.signature),
    ).thenReturn(undefined);
  }

  public runFailureScenarios() {
    td.when(
      this.gatewayConnectorRepository.getGatewaySignature(this.gatewayUrl),
    ).thenReturn(okAsync(Signature(this.signature)));
    td.when(
      this.gatewayConnectorRepository.getGatewayAddress(this.gatewayUrl),
    ).thenReturn(okAsync(EthereumAddress(this.address + "1")));
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(this.gatewayUrl),
    ).thenReturn(okAsync(this.gatewayCode));
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(
        GatewayUrl(this.gatewayUrl + `?v=${this.nowTime}`),
      ),
    ).thenReturn(okAsync(this.gatewayCode));
  }

  public factoryGatewayService(): IGatewayService {
    return new GatewayService(
      this.gatewayConnectorRepository,
      this.persistenceRepository,
      this.hypernetCoreRepository,
      this.contextProvider,
    );
  }
}

describe("GatewayService tests", () => {
  test("Should validateGatewayConnector works without errors and getGatewayCode should get called once", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.validateGatewayConnector();
    const getGatewayCodeCallingcount = td.explain(
      gatewayServiceMock.gatewayConnectorRepository.getGatewayCode,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(getGatewayCodeCallingcount).toBe(1);
    expect(response._unsafeUnwrap()).toBe(gatewayServiceMock.signature);
  });

  test("Should validateGatewayConnector fails when gatewayCode doesn't match with signature and getGatewayCode should get called twice", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runFailureScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.validateGatewayConnector();
    const getGatewayCodeCallingcount = td.explain(
      gatewayServiceMock.gatewayConnectorRepository.getGatewayCode,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(getGatewayCodeCallingcount).toBe(2);
    expect(response._unsafeUnwrapErr()).toBeInstanceOf(GatewayValidationError);
  });
});
