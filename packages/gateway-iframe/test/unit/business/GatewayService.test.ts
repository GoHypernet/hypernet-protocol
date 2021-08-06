import {
  GatewayUrl,
  Signature,
  EthereumAddress,
  Balances,
  AssetBalance,
} from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";
import { JSDOM } from "jsdom";

import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import { GatewayService } from "@gateway-iframe/implementations/business";
import { ContextProvider } from "@gateway-iframe/implementations/utils";
import { IGatewayService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IGatewayConnectorRepository,
  IPersistenceRepository,
} from "@gateway-iframe/interfaces/data";
import { GatewayValidationError } from "@gateway-iframe/interfaces/objects/errors";
import {
  commonAmount,
  ethereumAddress,
  lockedAmount,
  publicIdentifier,
} from "@mock/mocks";

jest.mock("ethers", () => {
  let mockEthers = {};
  Object.keys(jest.requireActual("ethers")).forEach((key) => {
    mockEthers = {
      ...mockEthers,
      [key]: jest.requireActual("ethers")[key],
    };
  });
  return {
    ...mockEthers,
    ethers: {
      utils: {
        verifyMessage: () => {
          return "gatewayAddress";
        },
      },
    },
  };
});

class GatewayServiceMocks {
  public gatewayConnectorRepository = td.object<IGatewayConnectorRepository>();
  public persistenceRepository = td.object<IPersistenceRepository>();
  public hypernetCoreRepository = td.object<IHypernetCoreRepository>();
  public gatewayUrl = GatewayUrl("http://localhost:5010");
  public gatewayAddress = EthereumAddress("gatewayAddress");
  public gatewaySignature = Signature("gatewaySignature");
  public messageToBeSigned = "message";
  public nowTime = 1487076708000;
  public address = "0x14791697260E4c9A71f18484C9f997B308e59325";
  public gatewayCode = "some code";
  public gatewayConnector = td.object<IGatewayConnector>();
  public contextProvider = new ContextProvider(
    this.gatewayUrl,
    this.gatewayAddress,
    this.gatewaySignature,
  );
  public assetBalance = new AssetBalance(
    EthereumAddress(ethereumAddress),
    `Unknown Token`,
    "Unk",
    0,
    commonAmount,
    lockedAmount,
    commonAmount,
  );
  public balances = new Balances([this.assetBalance]);

  constructor() {
    const dom = new JSDOM(``, {
      url: `http://localhost:5020?gatewayUrl=${this.gatewayUrl}`,
    });
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.connector = this.gatewayConnector;
    //global.window.location.href =
    //"http://localhost:5010?gatewayUrl=http://localhost:4444";
    Date.now = jest.fn(() => this.nowTime);
  }

  public runSuccessScenarios() {
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(this.gatewayUrl),
    ).thenReturn(okAsync(this.gatewayCode));
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(
        GatewayUrl(this.gatewayUrl + `?v=${this.nowTime}`),
      ),
    ).thenReturn(okAsync(this.gatewayCode));

    td.when(
      this.persistenceRepository.addActivatedGatewaySignature(
        this.gatewaySignature,
      ),
    ).thenReturn(undefined);
    td.when(
      this.persistenceRepository.getActivatedGatewaySignatures(),
    ).thenReturn([Signature("validatedGatewaySignature")]);

    td.when(
      this.hypernetCoreRepository.emitSignMessageRequested(
        this.messageToBeSigned,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(this.gatewayConnector.deauthorize()).thenResolve(undefined);

    this.contextProvider.getGatewayContext().validatedGatewayCode = "code";
    this.contextProvider.getGatewayContext().validatedGatewaySignature =
      Signature("validatedGatewaySignature");
    this.contextProvider.getGatewayContext().gatewayValidated =
      okAsync(undefined);
    this.contextProvider.getGatewayContext().gatewayConnector =
      this.gatewayConnector;
  }

  public runFailureScenarios() {
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(this.gatewayUrl),
    ).thenReturn(okAsync(this.gatewayCode));
    td.when(
      this.gatewayConnectorRepository.getGatewayCode(
        GatewayUrl(this.gatewayUrl + `?v=${this.nowTime}`),
      ),
    ).thenReturn(okAsync(this.gatewayCode));

    td.when(this.gatewayConnector.deauthorize()).thenReject(new Error());

    this.contextProvider.getGatewayContext().validatedGatewayCode = null;
    this.contextProvider.getGatewayContext().validatedGatewaySignature = null;
    this.contextProvider.getGatewayContext().gatewayValidated =
      okAsync(undefined);
    this.contextProvider.getGatewayContext().gatewayConnector =
      this.gatewayConnector;
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
  test("Should activateGatewayConnector works without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.activateGatewayConnector(
      publicIdentifier,
      gatewayServiceMock.balances,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBeDefined();
  });

  test("Should activateGatewayConnector return GatewayValidationError if validatedGatewayCode is null", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();
    gatewayServiceMock.contextProvider.getGatewayContext().validatedGatewayCode =
      null;
    gatewayServiceMock.contextProvider.getGatewayContext().validatedGatewaySignature =
      Signature("validatedGatewaySignature");

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.activateGatewayConnector(
      publicIdentifier,
      gatewayServiceMock.balances,
    );
    const result = response._unsafeUnwrapErr();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(GatewayValidationError);
  });

  test("Should activateGatewayConnector return GatewayValidationError if validatedGatewaySignature is null", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();
    gatewayServiceMock.contextProvider.getGatewayContext().validatedGatewayCode =
      "validatedGatewayCode";
    gatewayServiceMock.contextProvider.getGatewayContext().validatedGatewaySignature =
      null;

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.activateGatewayConnector(
      publicIdentifier,
      gatewayServiceMock.balances,
    );
    const result = response._unsafeUnwrapErr();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(GatewayValidationError);
  });

  test("Should activateGatewayConnector return GatewayConnectorError if gatewayConnector is null", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();
    global.window.connector = null as any;

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.activateGatewayConnector(
      publicIdentifier,
      gatewayServiceMock.balances,
    );
    const result = response._unsafeUnwrapErr();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(Error);
  });

  test("Should validateGatewayConnector works without errors and getGatewayCode should get called once", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.validateGatewayConnector();
    const result = response._unsafeUnwrap();
    const getGatewayCodeCallingcount = td.explain(
      gatewayServiceMock.gatewayConnectorRepository.getGatewayCode,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(getGatewayCodeCallingcount).toBe(1);
    expect(result).toBe(gatewayServiceMock.gatewaySignature);
  });

  test("Should validateGatewayConnector fails when gatewayCode doesn't match with signature and getGatewayCode should get called twice", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runFailureScenarios();
    gatewayServiceMock.contextProvider.getGatewayContext().gatewayAddress =
      EthereumAddress("invalid address");

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.validateGatewayConnector();
    const result = response._unsafeUnwrapErr();
    const getGatewayCodeCallingcount = td.explain(
      gatewayServiceMock.gatewayConnectorRepository.getGatewayCode,
    ).callCount;

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(getGatewayCodeCallingcount).toBe(2);
    expect(result).toBeInstanceOf(GatewayValidationError);
  });

  test("Should autoActivateGatewayConnector works without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.autoActivateGatewayConnector();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBeDefined();
  });

  test("Should getGatewayUrl return GatewayValidationError if window or document are not presented", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();
    const dom = new JSDOM(``, {
      url: `http://localhost:5020`,
    });
    global.document = dom.window.document;
    global.window = dom.window;

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.getGatewayUrl();
    const result = response._unsafeUnwrapErr();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(GatewayValidationError);
  });

  test("Should getGatewayUrl return GatewayUrl without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.getGatewayUrl();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(gatewayServiceMock.gatewayUrl);
  });

  test("Should publicIdentifierReceived runs without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.publicIdentifierReceived(
      publicIdentifier,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should getValidatedSignature runs without errors and return validatedGatewaySignature", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.getValidatedSignature();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(Signature("validatedGatewaySignature"));
  });

  test("Should getValidatedSignature fails if validatedGatewaySignature is null", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runFailureScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    let result;
    try {
      await gatewayService.getValidatedSignature();
    } catch (err) {
      result = err;
    }

    // Assert
    expect(result).toBeInstanceOf(Error);
  });

  test("Should deauthorize runs without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.deauthorize();
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should deauthorize return GatewayConnectorError if deauthorize didnt resolve", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runFailureScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.deauthorize();
    const result = response._unsafeUnwrapErr();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    expect(result).toBeInstanceOf(Error);
  });

  test("Should signMessage runs without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.signMessage(
      gatewayServiceMock.messageToBeSigned,
      () => {},
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });

  test("Should messageSigned runs without errors", async () => {
    // Arrange
    const gatewayServiceMock = new GatewayServiceMocks();
    gatewayServiceMock.runSuccessScenarios();

    const gatewayService = gatewayServiceMock.factoryGatewayService();

    // Act
    const response = await gatewayService.messageSigned(
      gatewayServiceMock.messageToBeSigned,
      gatewayServiceMock.gatewaySignature,
    );
    const result = response._unsafeUnwrap();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(result).toBe(undefined);
  });
});
