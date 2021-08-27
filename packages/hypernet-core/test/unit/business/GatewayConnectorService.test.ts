import {
  AuthorizedGatewaysSchema,
  Balances,
  GatewayActivationError,
  GatewayRegistrationInfo,
  GatewayUrl,
  GatewayValidationError,
  ProxyError,
  Signature,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import {
  IAccountsRepository,
  IAuthorizedGatewayEntry,
  IGatewayConnectorRepository,
  IGatewayRegistrationRepository,
  IRouterRepository,
} from "@interfaces/data";
import {
  gatewayUrl,
  account,
  account2,
  routerChannelAddress,
  insuranceTransferId,
  commonPaymentId,
  gatewaySignature,
  gatewayUrl2,
  publicIdentifier,
  gatewayAddress,
  expirationDate,
} from "@mock/mocks";
import { errAsync, ok, okAsync } from "neverthrow";
import td, { verify } from "testdouble";

import { GatewayConnectorService } from "@implementations/business/GatewayConnectorService";
import { IGatewayConnectorService } from "@interfaces/business/IGatewayConnectorService";
import {
  IBlockchainUtils,
  IGatewayConnectorProxy,
} from "@interfaces/utilities";
import {
  BlockchainProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
} from "@tests/mock/utils";

const validatedSignature = Signature("0xValidatedSignature");
const newAuthorizationSignature = Signature("0xNewAuthorizationSignature");
const authorizationSignature = Signature(
  "0x1e866e66e7f3a68658bd186bafbdc534d4a5022e14022fddfe8865e2236dc67d64eee05b4d8f340dffa1928efa517784b63cad6a3fb35d999cb9d722b34075071b",
);
const balances = new Balances([]);

class GatewayConnectorServiceMocks {
  public gatewayConnectorRepository = td.object<IGatewayConnectorRepository>();
  public gatewayRegistrationRepository =
    td.object<IGatewayRegistrationRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public routerRepository = td.object<IRouterRepository>();

  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public gatewayConnectorProxy = td.object<IGatewayConnectorProxy>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public logUtils = td.object<ILogUtils>();

  public gatewayRegistrationInfo1 = new GatewayRegistrationInfo(
    gatewayUrl,
    account,
    gatewaySignature,
  );

  public gatewayRegistrationInfo2 = new GatewayRegistrationInfo(
    gatewayUrl2,
    account2,
    gatewaySignature,
  );

  public expectedSignerDomain = {
    name: "Hypernet Protocol",
    version: "1",
  };

  public expectedSignerTypes = {
    AuthorizedGateway: [
      { name: "authorizedGatewayUrl", type: "string" },
      { name: "gatewayValidatedSignature", type: "string" },
    ],
  };

  public expectedSignerValue = {
    authorizedGatewayUrl: gatewayUrl,
    gatewayValidatedSignature: validatedSignature,
  };

  constructor() {
    const authorizedGatewayEntry = [
      {
        gatewayUrl: gatewayUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(this.accountRepository.getBalances()).thenReturn(okAsync(balances));

    td.when(this.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(validatedSignature)),
    );

    td.when(
      this.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(okAsync(undefined));

    td.when(this.gatewayConnectorProxy.deauthorize()).thenReturn(
      okAsync(undefined),
    );

    td.when(
      this.blockchainUtils.verifyTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue),
        Signature(authorizationSignature),
      ),
    ).thenReturn(account as never);

    td.when(
      this.blockchainUtils.getGatewayRegistrationInfo(gatewayUrl),
    ).thenReturn(
      okAsync(this.gatewayRegistrationInfo1),
      errAsync(new Error("gatewayUrl called twice")),
    );

    td.when(
      this.blockchainUtils.getGatewayRegistrationInfo(gatewayUrl2),
    ).thenReturn(
      okAsync(this.gatewayRegistrationInfo2),
      errAsync(new Error("gatewayUrl2 called twice")),
    );

    td.when(
      this.blockchainProvider.signer._signTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue),
      ),
    ).thenResolve(newAuthorizationSignature);
  }

  public factoryGatewayConnectorService(): IGatewayConnectorService {
    return new GatewayConnectorService(
      this.gatewayConnectorRepository,
      this.gatewayRegistrationRepository,
      this.accountRepository,
      this.routerRepository,
      this.blockchainUtils,
      this.contextProvider,
      this.configProvider,
      this.blockchainProvider,
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
      gatewayUrl,
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
        gatewayUrl,
      ),
    ).thenReturn(
      new Promise((resolve, reject) =>
        setTimeout(() => resolve(ok(undefined)), 7000),
      ),
    );

    // Act
    const response = await gatewayConnectorService.deauthorizeGateway(
      gatewayUrl,
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

  test("activateAuthorizedGateways returns successfully", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();
    const repo = mocks.factoryGatewayConnectorService();

    // Act
    const result = await repo.activateAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("activateAuthorizedGateways re-authenticates if the signature has changed", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    td.when(
      mocks.blockchainUtils.verifyTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(mocks.expectedSignerValue),
        Signature(authorizationSignature),
      ),
    ).thenReturn(account2 as never);

    let onAuthorizedGatewayUpdatedVal: string | null = null;
    mocks.contextProvider.onAuthorizedGatewayUpdated.subscribe((val) => {
      onAuthorizedGatewayUpdatedVal = val.toString();
    });

    const repo = mocks.factoryGatewayConnectorService();

    // Act
    const result = await repo.activateAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedGatewayUpdatedVal).toBeDefined();
    expect(onAuthorizedGatewayUpdatedVal).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways passes if one of the gateway connector's signatures can't be verified by the iFrame.", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const error = new GatewayValidationError();
    td.when(mocks.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      errAsync(error),
    );

    let onAuthorizedGatewayActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedGatewayActivationFailed.subscribe(
      (val) => {
        onAuthorizedGatewayActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryGatewayConnectorService();

    // Act
    const result = await repo.activateAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedGatewayActivationFailedVal).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways passes if the connector can not be activated and make sure proxy is destroyed", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const error = new GatewayActivationError();
    td.when(
      mocks.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(errAsync(error));

    let onAuthorizedGatewayActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedGatewayActivationFailed.subscribe(
      (val) => {
        onAuthorizedGatewayActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryGatewayConnectorService();

    // Act
    const result = await repo.activateAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    verify(mocks.gatewayConnectorProxy.destroy());
    expect(onAuthorizedGatewayActivationFailedVal).toBe(gatewayUrl);
  });
});
