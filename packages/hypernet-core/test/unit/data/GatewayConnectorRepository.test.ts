import {
  Signature,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayRegistrationInfo,
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
import { okAsync } from "neverthrow";
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
    td.when(
      this.storageUtils.read<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
      ),
    ).thenReturn(
      okAsync([
        {
          gatewayUrl,
          authorizationSignature,
        },
      ]),
    );

    const authorizedGatewayEntry = [
      {
        gatewayUrl: gatewayUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      this.storageUtils.write<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
        authorizedGatewayEntry,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.storageUtils.write<IAuthorizedGatewayEntry[]>(
        AuthorizedGatewaysSchema.title,
        [],
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.gatewayConnectorProxyFactory.factoryProxy(
        this.gatewayRegistrationInfo1,
      ),
    ).thenReturn(okAsync(this.gatewayConnectorProxy));

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
});
