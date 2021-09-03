/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VectorError } from "@connext/vector-types";
import {
  ActiveStateChannel,
  AuthorizedGatewaysSchema,
  Balances,
  BalancesUnavailableError,
  BigNumberString,
  BlockchainUnavailableError,
  EPaymentState,
  GatewayActivationError,
  GatewayConnectorError,
  GatewayRegistrationInfo,
  GatewayTokenInfo,
  GatewayUrl,
  GatewayValidationError,
  PersistenceError,
  ProxyError,
  PullPayment,
  PushPayment,
  RouterDetails,
  RouterUnauthorizedError,
  Signature,
  SortedTransfers,
  SupportedToken,
} from "@hypernetlabs/objects";
import { ILogUtils, ResultUtils } from "@hypernetlabs/utils";
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
  gatewayRegistrationInfo,
  routerPublicIdentifier,
  chainId,
  hyperTokenAddress,
  activeStateChannel,
  gatewaySignature2,
  gatewayRegistrationInfo2,
  gatewaySignature3,
  publicIdentifier2,
  unixNow,
  commonAmount,
  activeOfferTransfer,
  activeInsuranceTransfer,
  activeParameterizedTransfer,
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

const newAuthorizationSignature = Signature("0xNewAuthorizationSignature");
const authorizationSignature1 = Signature("0xauthorizationSignature1");
const authorizationSignature2 = Signature("0xauthorizationSignature2");
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
  public gatewayConnectorProxy2 = td.object<IGatewayConnectorProxy>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public logUtils = td.object<ILogUtils>();

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

  public expectedSignerValue1 = {
    authorizedGatewayUrl: gatewayUrl,
    gatewayValidatedSignature: gatewaySignature,
  };

  public expectedSignerValue2 = {
    authorizedGatewayUrl: gatewayUrl2,
    gatewayValidatedSignature: gatewaySignature2,
  };

  constructor(includeAuthorizedGateway = false) {
    td.when(this.accountRepository.getBalances()).thenReturn(okAsync(balances));
    td.when(
      this.accountRepository.createStateChannel(
        routerPublicIdentifier,
        chainId,
      ),
    ).thenReturn(okAsync(routerChannelAddress));
    td.when(
      this.accountRepository.addActiveRouter(routerPublicIdentifier),
    ).thenReturn(okAsync(undefined));

    td.when(this.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(gatewaySignature)),
    );
    td.when(
      this.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(okAsync(undefined));
    td.when(this.gatewayConnectorProxy.deauthorize()).thenReturn(
      okAsync(undefined),
    );
    td.when(this.gatewayConnectorProxy.getGatewayTokenInfo()).thenReturn(
      okAsync([
        new GatewayTokenInfo(hyperTokenAddress, chainId, [
          routerPublicIdentifier,
        ]),
      ]),
    );
    td.when(this.gatewayConnectorProxy.deauthorize()).thenReturn(
      okAsync(undefined),
    );
    td.when(
      this.gatewayConnectorProxy.getConnectorActivationStatus(),
    ).thenReturn(true);
    this.gatewayConnectorProxy.gatewayUrl = gatewayUrl;
    td.when(this.gatewayConnectorProxy.closeGatewayIFrame()).thenReturn(
      okAsync(undefined),
    );
    td.when(this.gatewayConnectorProxy.displayGatewayIFrame()).thenReturn(
      okAsync(undefined),
    );

    td.when(this.gatewayConnectorProxy2.getValidatedSignature()).thenReturn(
      okAsync(Signature(gatewaySignature2)),
    );
    td.when(
      this.gatewayConnectorProxy2.activateConnector(publicIdentifier, balances),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.gatewayConnectorProxy2.getConnectorActivationStatus(),
    ).thenReturn(true);
    this.gatewayConnectorProxy2.gatewayUrl = gatewayUrl2;

    td.when(
      this.blockchainUtils.verifyTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue1),
        Signature(authorizationSignature1),
      ),
    ).thenReturn(account as never);
    td.when(
      this.blockchainUtils.verifyTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue2),
        Signature(authorizationSignature2),
      ),
    ).thenReturn(account as never);

    td.when(
      this.blockchainProvider.signer._signTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue1),
      ),
    ).thenResolve(newAuthorizationSignature);

    if (includeAuthorizedGateway) {
      td.when(
        this.gatewayConnectorRepository.getAuthorizedGateways(),
      ).thenReturn(
        okAsync(
          new Map<GatewayUrl, Signature>([
            [gatewayUrl, authorizationSignature1],
            [gatewayUrl2, authorizationSignature2],
          ]),
        ),
      );
    } else {
      td.when(
        this.gatewayConnectorRepository.getAuthorizedGateways(),
      ).thenReturn(okAsync(new Map<GatewayUrl, Signature>()));
    }
    td.when(
      this.gatewayConnectorRepository.createGatewayProxy(
        td.matchers.contains(gatewayRegistrationInfo),
      ),
    ).thenReturn(okAsync(this.gatewayConnectorProxy));
    td.when(
      this.gatewayConnectorRepository.createGatewayProxy(
        td.matchers.contains(gatewayRegistrationInfo2),
      ),
    ).thenReturn(okAsync(this.gatewayConnectorProxy2));
    td.when(
      this.gatewayConnectorRepository.addAuthorizedGateway(
        gatewayUrl,
        newAuthorizationSignature,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.gatewayConnectorRepository.destroyProxy(gatewayUrl),
    ).thenReturn();

    td.when(
      this.gatewayRegistrationRepository.getGatewayRegistrationInfo([]),
    ).thenReturn(okAsync(new Map()));
    td.when(
      this.gatewayRegistrationRepository.getGatewayRegistrationInfo([
        gatewayUrl,
      ]),
    ).thenReturn(okAsync(new Map([[gatewayUrl, gatewayRegistrationInfo]])));
    td.when(
      this.gatewayRegistrationRepository.getGatewayRegistrationInfo([
        gatewayUrl,
        gatewayUrl2,
      ]),
    ).thenReturn(
      okAsync(
        new Map([
          [gatewayUrl, gatewayRegistrationInfo],
          [gatewayUrl2, gatewayRegistrationInfo2],
        ]),
      ),
    );
    td.when(
      this.gatewayRegistrationRepository.getFilteredGatewayRegistrationInfo(
        undefined,
      ),
    ).thenReturn(okAsync([gatewayRegistrationInfo, gatewayRegistrationInfo2]));

    td.when(
      this.routerRepository.getRouterDetails([routerPublicIdentifier]),
    ).thenReturn(
      okAsync(
        new Map([
          [
            routerPublicIdentifier,
            new RouterDetails(
              routerPublicIdentifier,
              [new SupportedToken(chainId, hyperTokenAddress)],
              [gatewayUrl, gatewayUrl2],
            ),
          ],
        ]),
      ),
    );
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
  test("authorizeGateway with new gateway succeeds", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(undefined);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onGatewayAuthorized: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(mocks.contextProvider.onGatewayAuthorizedActivations[0]).toBe(
      gatewayUrl,
    );
  });

  test("authorizeGateway returns the same gateway if called multiple times", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response0 = gatewayConnectorService.authorizeGateway(gatewayUrl);
    const response1 = await gatewayConnectorService.authorizeGateway(
      gatewayUrl,
    );
    const response2 = await response0;

    // Assert
    expect(response1).toBeDefined();
    expect(response1.isErr()).toBeFalsy();
    expect(response1._unsafeUnwrap()).toBe(undefined);
    expect(response2).toBeDefined();
    expect(response2.isErr()).toBeFalsy();
    expect(response2._unsafeUnwrap()).toBe(undefined);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onGatewayAuthorized: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(mocks.contextProvider.onGatewayAuthorizedActivations[0]).toBe(
      gatewayUrl,
    );
  });

  test("authorizeGateway returns an error if getAuthorizedGateways fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorRepository.getAuthorizedGateways(),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
  });

  test("authorizeGateway returns an error if getBalances fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new BalancesUnavailableError();
    td.when(mocks.accountRepository.getBalances()).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
  });

  test("authorizeGateway returns an error if getGatewayRegistrationInfo fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new BlockchainUnavailableError();
    td.when(
      mocks.gatewayRegistrationRepository.getGatewayRegistrationInfo(
        td.matchers.contains([gatewayUrl]),
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
  });

  test("authorizeGateway returns an error if createGatewayProxy fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new ProxyError();
    td.when(
      mocks.gatewayConnectorRepository.createGatewayProxy(
        td.matchers.contains(gatewayRegistrationInfo),
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(GatewayActivationError);
    mocks.contextProvider.assertEventCounts({
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("authorizeGateway returns an error if getValidatedSignature fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new GatewayValidationError();
    td.when(mocks.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      errAsync(err),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(GatewayActivationError);
    mocks.contextProvider.assertEventCounts({
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("authorizeGateway returns an error if _signTypedData fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new GatewayValidationError();
    td.when(
      mocks.blockchainProvider.signer._signTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(mocks.expectedSignerValue1),
      ),
    ).thenReject(new Error("Signature rejected"));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(GatewayActivationError);
    mocks.contextProvider.assertEventCounts({
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("authorizeGateway returns an error if addAuthorizedGateway fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorRepository.addAuthorizedGateway(
        gatewayUrl,
        newAuthorizationSignature,
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(GatewayActivationError);
    mocks.contextProvider.assertEventCounts({
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("authorizeGateway returns an error if activateConnector fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.authorizeGateway(gatewayUrl);

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(GatewayActivationError);
    mocks.contextProvider.assertEventCounts({
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("ensureStateChannel succeeds with active state channels", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseChannelAddress = response._unsafeUnwrap();
    expect(responseChannelAddress).toBe(routerChannelAddress);
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
    mocks.contextProvider.assertEventCounts({});
  });

  test("ensureStateChannel fails with active state channels if the router details error", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.routerRepository.getRouterDetails([routerPublicIdentifier]),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
    mocks.contextProvider.assertEventCounts({});
  });

  test("ensureStateChannel fails with active state channels if the router has not published details", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    td.when(
      mocks.routerRepository.getRouterDetails([routerPublicIdentifier]),
    ).thenReturn(okAsync(new Map()));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(RouterUnauthorizedError);
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
    mocks.contextProvider.assertEventCounts({});
  });

  test("ensureStateChannel fails with active state channels if the router does not support this gateway", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    td.when(
      mocks.routerRepository.getRouterDetails([routerPublicIdentifier]),
    ).thenReturn(
      okAsync(
        new Map([
          [
            routerPublicIdentifier,
            new RouterDetails(
              routerPublicIdentifier,
              [new SupportedToken(chainId, hyperTokenAddress)],
              [gatewayUrl2],
            ),
          ],
        ]),
      ),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBeInstanceOf(RouterUnauthorizedError);
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
    mocks.contextProvider.assertEventCounts({});
  });

  test("ensureStateChannel succeeds with no active state channels", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    mocks.contextProvider.initializedContext.activeStateChannels = [];

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseChannelAddress = response._unsafeUnwrap();
    expect(responseChannelAddress).toBe(routerChannelAddress);
    mocks.contextProvider.assertEventCounts({
      onStateChannelCreated: 1,
    });
    expect(
      mocks.contextProvider.onStateChannelCreatedActivations[0],
    ).toMatchObject(activeStateChannel);
    expect(mocks.contextProvider.setContextValues.length).toBe(1);
    expect(
      mocks.contextProvider.setContextValues[0].activeStateChannels?.length,
    ).toBe(1);
    expect(
      mocks.contextProvider.setContextValues[0].activeStateChannels?.[0],
    ).toMatchObject(activeStateChannel);
  });

  test("ensureStateChannel fails with no active state channels and createStateChannel fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    mocks.contextProvider.initializedContext.activeStateChannels = [];
    const err = new VectorError("");
    td.when(
      mocks.accountRepository.createStateChannel(
        routerPublicIdentifier,
        chainId,
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("ensureStateChannel fails with no active state channels and addActiveRouter fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    mocks.contextProvider.initializedContext.activeStateChannels = [];
    const err = new PersistenceError();
    td.when(
      mocks.accountRepository.addActiveRouter(routerPublicIdentifier),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.ensureStateChannel(
      gatewayUrl,
      chainId,
      [routerPublicIdentifier],
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("activateAuthorizedGateways succeeds", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("activateAuthorizedGateways succeeds when gateway 1 has changed", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    td.when(mocks.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(gatewaySignature3)),
    );

    td.when(
      mocks.gatewayRegistrationRepository.getGatewayRegistrationInfo([
        gatewayUrl,
        gatewayUrl2,
      ]),
    ).thenReturn(
      okAsync(
        new Map([
          [
            gatewayUrl,
            new GatewayRegistrationInfo(
              gatewayUrl,
              gatewayAddress,
              gatewaySignature3,
            ),
          ],
          [gatewayUrl2, gatewayRegistrationInfo2],
        ]),
      ),
    );

    const newValue = {
      authorizedGatewayUrl: gatewayUrl,
      gatewayValidatedSignature: gatewaySignature3,
    };
    td.when(
      mocks.blockchainUtils.verifyTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(newValue),
        Signature(authorizationSignature1),
      ),
    ).thenReturn(account2 as never);

    td.when(
      mocks.blockchainProvider.signer._signTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(newValue),
      ),
    ).thenResolve(newAuthorizationSignature);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
      onAuthorizedGatewayUpdated: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(mocks.contextProvider.onAuthorizedGatewayUpdatedActivations[0]).toBe(
      gatewayUrl,
    );
  });

  test("activateAuthorizedGateways succeeds with 0 proxies when getBalances fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new BalancesUnavailableError();
    td.when(mocks.accountRepository.getBalances()).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({});
  });

  test("activateAuthorizedGateways succeeds with 0 proxies when getAuthorizedGateways fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorRepository.getAuthorizedGateways(),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({});
  });

  test("activateAuthorizedGateways succeeds with 0 proxies when getGatewayRegistrationInfo fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new BlockchainUnavailableError();
    td.when(
      mocks.gatewayRegistrationRepository.getGatewayRegistrationInfo(
        td.matchers.contains([gatewayUrl]),
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({});
  });

  test("activateAuthorizedGateways creates 1/2 proxies when createGatewayProxy fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new ProxyError();
    td.when(
      mocks.gatewayConnectorRepository.createGatewayProxy(
        td.matchers.contains(gatewayRegistrationInfo),
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways creates 1/2 proxies when getValidatedSignature fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new GatewayValidationError();
    td.when(mocks.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      errAsync(err),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways creates 1/2 proxies when activateConnector fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new GatewayActivationError();
    td.when(
      mocks.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways creates 1/2 proxies when connector changes and authorization is denied", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    td.when(mocks.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(gatewaySignature3)),
    );

    td.when(
      mocks.gatewayRegistrationRepository.getGatewayRegistrationInfo([
        gatewayUrl,
        gatewayUrl2,
      ]),
    ).thenReturn(
      okAsync(
        new Map([
          [
            gatewayUrl,
            new GatewayRegistrationInfo(
              gatewayUrl,
              gatewayAddress,
              gatewaySignature3,
            ),
          ],
          [gatewayUrl2, gatewayRegistrationInfo2],
        ]),
      ),
    );

    const newValue = {
      authorizedGatewayUrl: gatewayUrl,
      gatewayValidatedSignature: gatewaySignature3,
    };
    td.when(
      mocks.blockchainUtils.verifyTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(newValue),
        Signature(authorizationSignature1),
      ),
    ).thenReturn(account2 as never);

    td.when(
      mocks.blockchainProvider.signer._signTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(newValue),
      ),
    ).thenReject(new Error("REJECTED!"));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.activateAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onAuthorizedGatewayActivationFailed: 1,
      onAuthorizedGatewayUpdated: 1,
      onGatewayDeauthorizationStarted: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
    expect(mocks.contextProvider.onAuthorizedGatewayUpdatedActivations[0]).toBe(
      gatewayUrl,
    );
    expect(
      mocks.contextProvider.onGatewayDeauthorizationStartedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("getGatewayTokenInfo succeeds", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.getGatewayTokenInfo([gatewayUrl]);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseInfo = response._unsafeUnwrap();
    expect(responseInfo).toBeDefined();
    expect(responseInfo.size).toBe(1);
    const responseTokenInfoArray = responseInfo.get(gatewayUrl);
    expect(responseTokenInfoArray).toBeDefined();
    expect(responseTokenInfoArray?.length).toBe(1);
    const responseTokenInfo = responseTokenInfoArray![0];
    expect(responseTokenInfo).toMatchObject(
      new GatewayTokenInfo(hyperTokenAddress, chainId, [
        routerPublicIdentifier,
      ]),
    );
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("getGatewayTokenInfo fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new ProxyError();
    td.when(mocks.gatewayConnectorProxy.getGatewayTokenInfo()).thenReturn(
      errAsync(err),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.getGatewayTokenInfo([gatewayUrl]);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("getGatewayRegistrationInfo succeeds with no filter", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(false);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.getGatewayRegistrationInfo();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseInfo = response._unsafeUnwrap();
    expect(responseInfo).toBeDefined();
    expect(responseInfo.length).toBe(2);
    const responseGatewayRegistationInfo1 = responseInfo[0];
    expect(responseGatewayRegistationInfo1).toMatchObject(
      gatewayRegistrationInfo,
    );
    const responseGatewayRegistationInfo2 = responseInfo[1];
    expect(responseGatewayRegistationInfo2).toMatchObject(
      gatewayRegistrationInfo2,
    );
    mocks.contextProvider.assertEventCounts({});
  });

  test("getGatewayRegistrationInfo fails when getFilteredGatewayRegistrationInfo fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks();

    const err = new PersistenceError();
    td.when(
      mocks.gatewayRegistrationRepository.getFilteredGatewayRegistrationInfo(
        undefined,
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.getGatewayRegistrationInfo();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
  });

  test("deauthorizeGateway works without errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.deauthorizeGateway(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(undefined);
    mocks.contextProvider.assertEventCounts({
      onGatewayDeauthorizationStarted: 1,
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayDeauthorizationStartedActivations[0],
    ).toBe(gatewayUrl);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
    const destroyProxyCount = td.explain(
      mocks.gatewayConnectorRepository.destroyProxy,
    ).callCount;
    expect(destroyProxyCount).toBe(1);
  });

  test("deauthorizeGateway destroys the proxy even when deauthorizeGateway fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorRepository.deauthorizeGateway(gatewayUrl),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.deauthorizeGateway(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({
      onGatewayDeauthorizationStarted: 1,
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayDeauthorizationStartedActivations[0],
    ).toBe(gatewayUrl);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
    const destroyProxyCount = td.explain(
      mocks.gatewayConnectorRepository.destroyProxy,
    ).callCount;
    expect(destroyProxyCount).toBe(1);
  });

  test("getAuthorizedGateways works without errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.getAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const authorizedGateways = response._unsafeUnwrap();
    expect(authorizedGateways).toMatchObject(
      new Map<GatewayUrl, Signature>([
        [gatewayUrl, authorizationSignature1],
        [gatewayUrl2, authorizationSignature2],
      ]),
    );
    mocks.contextProvider.assertEventCounts({});
  });

  test("getAuthorizedGateways fails if gatewayConnectorRepository.getAuthorizedGateways fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new PersistenceError();
    td.when(
      mocks.gatewayConnectorRepository.getAuthorizedGateways(),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.getAuthorizedGateways();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({});
  });

  test("getAuthorizedGatewaysConnectorsStatus works without errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.getAuthorizedGatewaysConnectorsStatus();
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseMap = response._unsafeUnwrap();
    expect(responseMap.size).toBe(2);
    const connectorStatus1 = responseMap.get(gatewayUrl);
    const connectorStatus2 = responseMap.get(gatewayUrl2);
    expect(connectorStatus1).toBeDefined();
    expect(connectorStatus1).toBe(true);
    expect(connectorStatus2).toBeDefined();
    expect(connectorStatus2).toBe(true);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("getAuthorizedGatewaysConnectorsStatus works when activation failed", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new ProxyError();
    td.when(
      mocks.gatewayConnectorRepository.createGatewayProxy(
        td.matchers.contains(gatewayRegistrationInfo),
      ),
    ).thenReturn(errAsync(err));

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.getAuthorizedGatewaysConnectorsStatus();
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseMap = response._unsafeUnwrap();
    expect(responseMap.size).toBe(2);
    const connectorStatus1 = responseMap.get(gatewayUrl);
    const connectorStatus2 = responseMap.get(gatewayUrl2);
    expect(connectorStatus1).toBeDefined();
    expect(connectorStatus1).toBe(false);
    expect(connectorStatus2).toBeDefined();
    expect(connectorStatus2).toBe(true);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 1,
      onAuthorizedGatewayActivationFailed: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy2);
    expect(
      mocks.contextProvider.onAuthorizedGatewayActivationFailedActivations[0],
    ).toBe(gatewayUrl);
  });

  test("getAuthorizedGatewaysConnectorsStatus works when proxy says it is not activated", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    td.when(
      mocks.gatewayConnectorProxy.getConnectorActivationStatus(),
    ).thenReturn(false);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.getAuthorizedGatewaysConnectorsStatus();
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    const responseMap = response._unsafeUnwrap();
    expect(responseMap.size).toBe(2);
    const connectorStatus1 = responseMap.get(gatewayUrl);
    const connectorStatus2 = responseMap.get(gatewayUrl2);
    expect(connectorStatus1).toBeDefined();
    expect(connectorStatus1).toBe(false);
    expect(connectorStatus2).toBeDefined();
    expect(connectorStatus2).toBe(true);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("closeGatewayIFrame works without errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.closeGatewayIFrame(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("closeGatewayIFrame fails if closeGatewayIFrame fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new GatewayConnectorError();
    td.when(mocks.gatewayConnectorProxy.closeGatewayIFrame()).thenReturn(
      errAsync(err),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.closeGatewayIFrame(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("displayGatewayIFrame works without errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.displayGatewayIFrame(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("displayGatewayIFrame fails if displayGatewayIFrame fails", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const err = new GatewayConnectorError();
    td.when(mocks.gatewayConnectorProxy.displayGatewayIFrame()).thenReturn(
      errAsync(err),
    );

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .activateAuthorizedGateways()
      .andThen(() => {
        return gatewayConnectorService.displayGatewayIFrame(gatewayUrl);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeTruthy();
    const responseErr = response._unsafeUnwrapErr();
    expect(responseErr).toBe(err);
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);
  });

  test("initialize runs", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService.initialize();

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({});
  });

  test("initialize subscriptions work", async () => {
    // Arrange
    const mocks = new GatewayConnectorServiceMocks(true);

    const pushPayment = new PushPayment(
      commonPaymentId,
      routerPublicIdentifier,
      chainId,
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Proposed,
      hyperTokenAddress,
      commonAmount,
      BigNumberString("0"),
      expirationDate,
      unixNow,
      unixNow,
      BigNumberString("0"),
      gatewayUrl,
      new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer],
        [activeParameterizedTransfer],
        [],
      ),
      null,
      commonAmount,
      BigNumberString("0"),
    );

    const pullPayment = new PullPayment(
      commonPaymentId,
      routerPublicIdentifier,
      chainId,
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Proposed,
      hyperTokenAddress,
      commonAmount,
      BigNumberString("0"),
      expirationDate,
      unixNow,
      unixNow,
      BigNumberString("0"),
      gatewayUrl,
      new SortedTransfers(
        [activeOfferTransfer],
        [activeInsuranceTransfer],
        [activeParameterizedTransfer],
        [],
      ),
      null,
      commonAmount,
      BigNumberString("0"),
      BigNumberString("0"), // vestedAmount
      1, // deltaTime
      BigNumberString("1"), // deltaAmount
      [], // ledger
    );

    const newBalances = new Balances([]);

    const gatewayConnectorService = mocks.factoryGatewayConnectorService();

    // Act
    const response = await gatewayConnectorService
      .initialize()
      .andThen(() => {
        return gatewayConnectorService.activateAuthorizedGateways();
      })
      .andThen(() => {
        mocks.contextProvider.onPushPaymentSent.next(pushPayment);
        mocks.contextProvider.onPushPaymentUpdated.next(pushPayment);
        mocks.contextProvider.onPushPaymentReceived.next(pushPayment);
        mocks.contextProvider.onPushPaymentDelayed.next(pushPayment);
        mocks.contextProvider.onPushPaymentCanceled.next(pushPayment);

        mocks.contextProvider.onPullPaymentSent.next(pullPayment);
        mocks.contextProvider.onPullPaymentUpdated.next(pullPayment);
        mocks.contextProvider.onPullPaymentReceived.next(pullPayment);
        mocks.contextProvider.onPullPaymentDelayed.next(pullPayment);
        mocks.contextProvider.onPullPaymentCanceled.next(pullPayment);

        mocks.contextProvider.onBalancesChanged.next(newBalances);

        return ResultUtils.delay(1000);
      });

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onGatewayConnectorActivated: 2,
      onPushPaymentSent: 1,
      onPushPaymentUpdated: 1,
      onPushPaymentReceived: 1,
      onPushPaymentDelayed: 1,
      onPushPaymentCanceled: 1,
      onPullPaymentSent: 1,
      onPullPaymentUpdated: 1,
      onPullPaymentReceived: 1,
      onPullPaymentDelayed: 1,
      onPullPaymentCanceled: 1,
      onBalancesChanged: 1,
    });
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[0],
    ).toBe(mocks.gatewayConnectorProxy);
    expect(
      mocks.contextProvider.onGatewayConnectorActivatedActivations[1],
    ).toBe(mocks.gatewayConnectorProxy2);

    td.verify(mocks.gatewayConnectorProxy.notifyPushPaymentSent(pushPayment));
    td.verify(
      mocks.gatewayConnectorProxy.notifyPushPaymentUpdated(pushPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPushPaymentReceived(pushPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPushPaymentDelayed(pushPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPushPaymentCanceled(pushPayment),
    );

    td.verify(mocks.gatewayConnectorProxy.notifyPullPaymentSent(pullPayment));
    td.verify(
      mocks.gatewayConnectorProxy.notifyPullPaymentUpdated(pullPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPullPaymentReceived(pullPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPullPaymentDelayed(pullPayment),
    );
    td.verify(
      mocks.gatewayConnectorProxy.notifyPullPaymentCanceled(pullPayment),
    );

    td.verify(mocks.gatewayConnectorProxy.notifyBalancesReceived(newBalances));
    td.verify(mocks.gatewayConnectorProxy2.notifyBalancesReceived(newBalances));
  });
});
