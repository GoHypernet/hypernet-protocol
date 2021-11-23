import {
  Signature,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayRegistrationInfo,
  ProxyError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { GatewayConnectorRepository } from "@implementations/data/GatewayConnectorRepository";
import {
  IGatewayConnectorRepository,
  IAuthorizedGatewayEntry,
} from "@interfaces/data/IGatewayConnectorRepository";
import {
  gatewayUrl,
  account,
  account2,
  gatewaySignature,
  gatewayUrl2,
  publicIdentifier,
} from "@mock/mocks";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { IStorageUtils } from "@interfaces/data/utilities";
import { IGatewayConnectorProxy } from "@interfaces/utilities";
import { IGatewayConnectorProxyFactory } from "@interfaces/utilities/factory";

const validatedSignature = Signature("0xValidatedSignature");
const newAuthorizationSignature = Signature("0xNewAuthorizationSignature");
const authorizationSignature = Signature(
  "0x1e866e66e7f3a68658bd186bafbdc534d4a5022e14022fddfe8865e2236dc67d64eee05b4d8f340dffa1928efa517784b63cad6a3fb35d999cb9d722b34075071b",
);
const balances = new Balances([]);

class GatewayConnectorRepositoryMocks {
  public gatewayConnectorProxyFactory =
    td.object<IGatewayConnectorProxyFactory>();
  public gatewayConnectorProxy = td.object<IGatewayConnectorProxy>();
  public storageUtils = td.object<IStorageUtils>();
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

  public authorizedGatewayEntry = {
    gatewayUrl: gatewayUrl,
    authorizationSignature: authorizationSignature,
  };

  public newAuthorizedGatewayEntry = {
    gatewayUrl: gatewayUrl2,
    authorizationSignature: newAuthorizationSignature,
  };

  constructor() {
    td.when(
      this.storageUtils.read<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
      ),
    ).thenReturn(okAsync([this.authorizedGatewayEntry]));

    td.when(
      this.gatewayConnectorProxyFactory.factoryProxy(
        this.gatewayRegistrationInfo1,
      ),
      {
        times: 1,
      },
    ).thenReturn(okAsync(this.gatewayConnectorProxy));

    td.when(this.gatewayConnectorProxy.activateProxy()).thenReturn(
      okAsync(undefined),
    );
    td.when(this.gatewayConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(validatedSignature)),
    );
    td.when(
      this.gatewayConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(okAsync(undefined));
    td.when(this.gatewayConnectorProxy.deauthorize()).thenReturn(
      okAsync(undefined),
    );
  }

  public factoryRepository(): IGatewayConnectorRepository {
    return new GatewayConnectorRepository(
      this.storageUtils,
      this.gatewayConnectorProxyFactory,
      this.logUtils,
    );
  }
}

describe("GatewayConnectorRepository tests", () => {
  test("addAuthorizedGateway properly adds an entry", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();
    td.when(
      mocks.storageUtils.read<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
      ),
    ).thenReturn(okAsync([mocks.authorizedGatewayEntry]));
    td.when(
      mocks.storageUtils.write<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
        [
          td.matchers.contains(mocks.authorizedGatewayEntry),
          td.matchers.contains(mocks.newAuthorizedGatewayEntry),
        ],
      ),
    ).thenReturn(okAsync(undefined));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedGateway(
      gatewayUrl2,
      newAuthorizationSignature,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("getAuthorizedGateways returns a map", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const authorizedGateways = result._unsafeUnwrap();
    expect(authorizedGateways.size).toBe(1);
    expect(authorizedGateways.get(gatewayUrl)).toBe(authorizationSignature);
  });

  test("getAuthorizedGateways returns an empty map", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    td.when(mocks.storageUtils.read(AuthorizedGatewaysSchema.title)).thenReturn(
      okAsync(null),
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const authorizedGateways = result._unsafeUnwrap();
    expect(authorizedGateways.size).toBe(0);
  });

  test("createGatewayProxy no existing proxy, no requests", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const proxy = result._unsafeUnwrap();
    expect(proxy).toBe(mocks.gatewayConnectorProxy);
  });

  test("createGatewayProxy returns cached proxy", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    await repo.createGatewayProxy(mocks.gatewayRegistrationInfo1);
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const proxy = result._unsafeUnwrap();
    expect(proxy).toBe(mocks.gatewayConnectorProxy);
  });

  test("createGatewayProxy completes a request", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    const getPromise = repo.getGatewayProxy(gatewayUrl);
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );
    const getResult = await getPromise;

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(getResult).toBeDefined();
    expect(getResult.isErr()).toBeFalsy();
    const proxy = result._unsafeUnwrap();
    const getProxy = result._unsafeUnwrap();
    expect(proxy).toBe(mocks.gatewayConnectorProxy);
    expect(getProxy).toBe(mocks.gatewayConnectorProxy);
  });

  test("createGatewayProxy errors when factory errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();
    const proxyError = new ProxyError();

    td.when(
      mocks.gatewayConnectorProxyFactory.factoryProxy(
        mocks.gatewayRegistrationInfo1,
      ),
    ).thenReturn(errAsync(proxyError));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBe(proxyError);
  });

  test("createGatewayProxy errors when proxy activation errors", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();
    const proxyError = new ProxyError();

    td.when(mocks.gatewayConnectorProxy.activateProxy()).thenReturn(
      errAsync(proxyError),
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBe(proxyError);
  });

  test("createGatewayProxy errors and outstanding requests error", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();
    const proxyError = new ProxyError();

    td.when(
      mocks.gatewayConnectorProxyFactory.factoryProxy(
        mocks.gatewayRegistrationInfo1,
      ),
    ).thenReturn(errAsync(proxyError));

    const repo = mocks.factoryRepository();

    // Act
    const getPromise = repo.getGatewayProxy(gatewayUrl);
    const result = await repo.createGatewayProxy(
      mocks.gatewayRegistrationInfo1,
    );
    const getResult = await getPromise;

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(getResult).toBeDefined();
    expect(getResult.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    const getErr = getResult._unsafeUnwrapErr();
    expect(err).toBe(proxyError);
    expect(getErr).toBe(proxyError);
  });

  test("getGatewayProxy returns existing proxy", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    await repo.createGatewayProxy(mocks.gatewayRegistrationInfo1);
    const result = await repo.getGatewayProxy(gatewayUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const proxy = result._unsafeUnwrap();
    expect(proxy).toBe(mocks.gatewayConnectorProxy);
  });

  test("getGatewayProxy waits for proxy to be created", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    const resultPromise = repo.getGatewayProxy(gatewayUrl);
    await repo.createGatewayProxy(mocks.gatewayRegistrationInfo1);
    const result = await resultPromise;

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const proxy = result._unsafeUnwrap();
    expect(proxy).toBe(mocks.gatewayConnectorProxy);
  });

  test("destroyProxy deletes the proxy", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    const repo = mocks.factoryRepository();

    // Act
    await repo.createGatewayProxy(mocks.gatewayRegistrationInfo1);
    repo.destroyProxy(gatewayUrl);

    // Assert
    td.verify(mocks.gatewayConnectorProxy.destroy(), { times: 1 });
  });

  test("deauthorizeGateway returns successfully", async () => {
    // Arrange
    const mocks = new GatewayConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
      ),
    ).thenReturn(
      okAsync([mocks.authorizedGatewayEntry, mocks.newAuthorizedGatewayEntry]),
    );
    td.when(
      mocks.storageUtils.write<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
        [td.matchers.contains(mocks.newAuthorizedGatewayEntry)],
      ),
    ).thenReturn(okAsync(undefined));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.deauthorizeGateway(gatewayUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });
});
