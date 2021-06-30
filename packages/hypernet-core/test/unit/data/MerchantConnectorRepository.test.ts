import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import {
  MerchantConnectorError,
  MerchantValidationError,
  Signature,
  Balances,
  TransferResolutionError,
  MerchantActivationError,
  ProxyError,
  AuthorizedGatewaysSchema,
} from "@hypernetlabs/objects";
import { IBasicTransferResponse } from "@hypernetlabs/objects";
import { IAjaxUtils, ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { okAsync, errAsync } from "neverthrow";
import td, { verify } from "testdouble";

import { MerchantConnectorRepository } from "@implementations/data/MerchantConnectorRepository";
import {
  IMerchantConnectorRepository,
  IAuthorizedMerchantEntry,
} from "@interfaces/data/IMerchantConnectorRepository";
import { IStorageUtils } from "@interfaces/data/utilities";
import {
  IVectorUtils,
  IMerchantConnectorProxy,
  IBlockchainUtils,
} from "@interfaces/utilities";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import {
  gatewayUrl,
  account,
  account2,
  routerChannelAddress,
  insuranceTransferId,
  commonPaymentId,
  mediatorSignature,
  merchantUrl2,
  publicIdentifier,
} from "@mock/mocks";
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
const resolutionAmount = "1";
const balances = new Balances([]);

class MerchantConnectorRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public ajaxUtils = td.object<IAjaxUtils>();
  public vectorUtils = td.object<IVectorUtils>();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public merchantConnectorProxyFactory = td.object<IMerchantConnectorProxyFactory>();
  public merchantConnectorProxy = td.object<IMerchantConnectorProxy>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public storageUtils = td.object<IStorageUtils>();
  public logUtils = td.object<ILogUtils>();

  public expectedSignerDomain = {
    name: "Hypernet Protocol",
    version: "1",
  };

  public expectedSignerTypes = {
    AuthorizedMerchant: [
      { name: "authorizedGatewayUrl", type: "string" },
      { name: "merchantValidatedSignature", type: "string" },
    ],
  };

  public expectedSignerValue = {
    authorizedGatewayUrl: gatewayUrl,
    merchantValidatedSignature: validatedSignature,
  };

  constructor() {
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(
      okAsync(routerChannelAddress),
    );
    td.when(
      this.vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        Signature(mediatorSignature),
        BigNumber.from(resolutionAmount),
      ),
    ).thenReturn(okAsync({} as IBasicTransferResponse));

    td.when(
      this.storageUtils.read<IAuthorizedMerchantEntry[]>(
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

    td.when(
      this.merchantConnectorProxyFactory.factoryProxy(gatewayUrl),
    ).thenReturn(okAsync(this.merchantConnectorProxy));

    td.when(this.merchantConnectorProxy.getValidatedSignature()).thenReturn(
      okAsync(Signature(validatedSignature)),
    );
    td.when(
      this.merchantConnectorProxy.activateConnector(publicIdentifier, balances),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.merchantConnectorProxy.resolveChallenge(commonPaymentId),
    ).thenReturn(
      okAsync({
        mediatorSignature,
        amount: resolutionAmount,
      } as IResolutionResult),
    );
    td.when(this.merchantConnectorProxy.getAddress()).thenReturn(
      okAsync(account),
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
      this.blockchainProvider.signer._signTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue),
      ),
    ).thenResolve(newAuthorizationSignature);
  }

  public factoryRepository(): IMerchantConnectorRepository {
    return new MerchantConnectorRepository(
      this.blockchainProvider,
      this.ajaxUtils,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.storageUtils,
      this.merchantConnectorProxyFactory,
      this.blockchainUtils,
      this.logUtils,
    );
  }
}

describe("MerchantConnectorRepository tests", () => {
  test("getAuthorizedGateways returns a map", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
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
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getAuthorizedGateways();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const authorizedGateways = result._unsafeUnwrap();
    expect(authorizedGateways.size).toBe(0);
  });

  test("activateAuthorizedGateways returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedGateways(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("activateAuthorizedGateways re-authenticates if the signature has changed", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.blockchainUtils.verifyTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(mocks.expectedSignerValue),
        Signature(authorizationSignature),
      ),
    ).thenReturn(account2 as never);

    const authorizedGatewayEntry = [
      {
        gatewayUrl: gatewayUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.storageUtils.write<IAuthorizedMerchantEntry[]>(
        AuthorizedGatewaysSchema.title,
        authorizedGatewayEntry,
      ),
    ).thenReturn(okAsync(undefined));

    let onAuthorizedMerchantUpdatedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantUpdated.subscribe((val) => {
      onAuthorizedMerchantUpdatedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedGateways(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantUpdatedVal).toBeDefined();
    expect(onAuthorizedMerchantUpdatedVal).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways passes if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new ProxyError();
    td.when(
      mocks.merchantConnectorProxyFactory.factoryProxy(gatewayUrl),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedGateways(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways passes if one of the merchant connector's signatures can't be verified by the iFrame.", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new MerchantValidationError();
    td.when(mocks.merchantConnectorProxy.getValidatedSignature()).thenReturn(
      errAsync(error),
    );

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedGateways(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("activateAuthorizedGateways passes if the connector can not be activated and make sure proxy is destroyed", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new MerchantActivationError();
    td.when(
      mocks.merchantConnectorProxy.activateConnector(
        publicIdentifier,
        balances,
      ),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedGateways(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    verify(mocks.merchantConnectorProxy.destroy());
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("resolveChallenge returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          gatewayUrl,
          commonPaymentId,
          insuranceTransferId,
        );
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("resolveChallenge fire an error if activateAuthorizedGateways is not called", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    let error = undefined;
    try {
      await repo.resolveChallenge(
        gatewayUrl,
        commonPaymentId,
        insuranceTransferId,
      );
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeDefined();
  });

  test("resolveChallenge returns an error if the merchant connector resolveChallenge fails", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.merchantConnectorProxy.resolveChallenge(commonPaymentId),
    ).thenReturn(errAsync(new MerchantConnectorError()));
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          gatewayUrl,
          commonPaymentId,
          insuranceTransferId,
        );
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(MerchantConnectorError);
  });

  test("resolveChallenge returns an error if the insurance transfer can not be resolved", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        Signature(mediatorSignature),
        BigNumber.from(resolutionAmount),
      ),
    ).thenReturn(errAsync(new TransferResolutionError()));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          gatewayUrl,
          commonPaymentId,
          insuranceTransferId,
        );
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TransferResolutionError);
  });

  test("addAuthorizedMerchant returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const authorizedGatewayEntry = [
      {
        gatewayUrl: gatewayUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.storageUtils.write<IAuthorizedMerchantEntry[]>(
        AuthorizedGatewaysSchema.title,
        authorizedGatewayEntry,
      ),
    ).thenReturn(okAsync(undefined));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(gatewayUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("addAuthorizedMerchant returns an error if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const error = new MerchantConnectorError();
    td.when(
      mocks.merchantConnectorProxyFactory.factoryProxy(gatewayUrl),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(gatewayUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantActivationError);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("addAuthorizedMerchant returns an error if proxy can not provide validated signature", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const error = new MerchantValidationError();
    td.when(mocks.merchantConnectorProxy.getValidatedSignature()).thenReturn(
      errAsync(error),
    );

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(gatewayUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantActivationError);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("addAuthorizedMerchant returns an error if signature is denied", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const error = new MerchantValidationError();
    td.when(
      mocks.blockchainProvider.signer._signTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(mocks.expectedSignerValue),
      ),
    ).thenReject(error);

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(gatewayUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantActivationError);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("addAuthorizedMerchant returns an error if connector can not be activated", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.storageUtils.read(AuthorizedGatewaysSchema.title),
    ).thenReturn(okAsync(null));

    const authorizedGatewayEntry = [
      {
        gatewayUrl: gatewayUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.storageUtils.write<IAuthorizedMerchantEntry[]>(
        AuthorizedGatewaysSchema.title,
        authorizedGatewayEntry,
      ),
    ).thenReturn(okAsync(undefined));

    const error = new MerchantConnectorError();
    td.when(
      mocks.merchantConnectorProxy.activateConnector(
        publicIdentifier,
        balances,
      ),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(gatewayUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantActivationError);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(gatewayUrl);
  });

  test("getMerchantAddresses returns successfully from activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([gatewayUrl]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(gatewayUrl)).toBe(account);
  });

  test("getMerchantAddresses returns successfully from non-activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${gatewayUrl}address`;
        }),
      ),
    ).thenReturn(okAsync(account));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getMerchantAddresses([gatewayUrl]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(gatewayUrl)).toBe(account);
  });

  test("getMerchantAddresses returns successfully from both types of merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl2}address`;
        }),
      ),
    ).thenReturn(okAsync(account2));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([gatewayUrl, merchantUrl2]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(2);
    expect(value.get(gatewayUrl)).toBe(account);
    expect(value.get(merchantUrl2)).toBe(account2);
  });

  test("getMerchantAddresses returns an error if a single merchant has an error", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new Error();
    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl2}address`;
        }),
      ),
    ).thenReturn(errAsync(error));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([gatewayUrl, merchantUrl2]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const value = result._unsafeUnwrapErr();
    expect(value).toBe(error);
  });

  test("getAuthorizedGatewaysConnectorsStatus returns map of merchant urls and status", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();
    const resultMap = new Map([[gatewayUrl, true]]);

    // Act
    const result = await repo
      .activateAuthorizedGateways(balances)
      .andThen(() => {
        return repo.getAuthorizedGatewaysConnectorsStatus();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value).toStrictEqual(resultMap);
  });

  test("deauthorizeMerchant without erros", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    td.when(mocks.merchantConnectorProxy.deauthorize()).thenReturn(
      okAsync(undefined),
    );

    // Act
    await repo.activateAuthorizedGateways(balances);
    const result = await repo.deauthorizeMerchant(gatewayUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(undefined);
  });

  test("deauthorizeMerchant returns ProxyError of proxy.deauthorize failes", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    td.when(mocks.merchantConnectorProxy.deauthorize()).thenReturn(
      errAsync(new ProxyError()),
    );

    // Act
    await repo.activateAuthorizedGateways(balances);
    const result = await repo.deauthorizeMerchant(gatewayUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ProxyError);
  });
});
