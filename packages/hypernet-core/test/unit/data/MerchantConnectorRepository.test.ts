import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import {
  MerchantConnectorError,
  MerchantValidationError,
  Signature,
  Balances,
  TransferResolutionError,
  MerchantActivationError,
  ProxyError,
  AuthorizedMerchantsSchema,
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
import {
  IVectorUtils,
  IMerchantConnectorProxy,
  IBlockchainUtils,
  ICeramicUtils,
} from "@interfaces/utilities";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import {
  merchantUrl,
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
  public ceramicUtils = td.object<ICeramicUtils>();
  public logUtils = td.object<ILogUtils>();

  public expectedSignerDomain = {
    name: "Hypernet Protocol",
    version: "1",
  };

  public expectedSignerTypes = {
    AuthorizedMerchant: [
      { name: "authorizedMerchantUrl", type: "string" },
      { name: "merchantValidatedSignature", type: "string" },
    ],
  };

  public expectedSignerValue = {
    authorizedMerchantUrl: merchantUrl,
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
      this.ceramicUtils.readRecord<IAuthorizedMerchantEntry[]>(
        AuthorizedMerchantsSchema.title,
      ),
    ).thenReturn(
      okAsync([
        {
          merchantUrl,
          authorizationSignature,
        },
      ]),
    );

    td.when(
      this.merchantConnectorProxyFactory.factoryProxy(merchantUrl),
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
      this.ceramicUtils,
      this.merchantConnectorProxyFactory,
      this.blockchainUtils,
      this.logUtils,
    );
  }
}

describe("MerchantConnectorRepository tests", () => {
  test("getAuthorizedMerchants returns a map", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const authorizedMerchants = result._unsafeUnwrap();
    expect(authorizedMerchants.size).toBe(1);
    expect(authorizedMerchants.get(merchantUrl)).toBe(authorizationSignature);
  });

  test("getAuthorizedMerchants returns an empty map", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
    ).thenReturn(okAsync(null));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const authorizedMerchants = result._unsafeUnwrap();
    expect(authorizedMerchants.size).toBe(0);
  });

  test("activateAuthorizedMerchants returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("activateAuthorizedMerchants re-authenticates if the signature has changed", async () => {
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

    const authorizedMerchantEntry = [
      {
        merchantUrl: merchantUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.ceramicUtils.writeRecord<IAuthorizedMerchantEntry[]>(
        AuthorizedMerchantsSchema.title,
        authorizedMerchantEntry,
      ),
    ).thenReturn(okAsync(undefined));

    let onAuthorizedMerchantUpdatedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantUpdated.subscribe((val) => {
      onAuthorizedMerchantUpdatedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantUpdatedVal).toBeDefined();
    expect(onAuthorizedMerchantUpdatedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants passes if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new ProxyError();
    td.when(
      mocks.merchantConnectorProxyFactory.factoryProxy(merchantUrl),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants passes if one of the merchant connector's signatures can't be verified by the iFrame.", async () => {
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
    const result = await repo.activateAuthorizedMerchants(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants passes if the connector can not be activated and make sure proxy is destroyed", async () => {
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
    const result = await repo.activateAuthorizedMerchants(balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    verify(mocks.merchantConnectorProxy.destroy());
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("resolveChallenge returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          merchantUrl,
          commonPaymentId,
          insuranceTransferId,
        );
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("resolveChallenge fire an error if activateAuthorizedMerchants is not called", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    let error = undefined;
    try {
      await repo.resolveChallenge(
        merchantUrl,
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
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          merchantUrl,
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
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.resolveChallenge(
          merchantUrl,
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
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
    ).thenReturn(okAsync(null));

    const authorizedMerchantEntry = [
      {
        merchantUrl: merchantUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.ceramicUtils.writeRecord<IAuthorizedMerchantEntry[]>(
        AuthorizedMerchantsSchema.title,
        authorizedMerchantEntry,
      ),
    ).thenReturn(okAsync(undefined));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("addAuthorizedMerchant returns an error if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
    ).thenReturn(okAsync(null));

    const error = new MerchantConnectorError();
    td.when(
      mocks.merchantConnectorProxyFactory.factoryProxy(merchantUrl),
    ).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe(
      (val) => {
        onAuthorizedMerchantActivationFailedVal = val.toString();
      },
    );

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantConnectorError);
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("addAuthorizedMerchant returns an error if proxy can not provide validated signature", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
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
    const result = await repo.addAuthorizedMerchant(merchantUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantValidationError);
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("addAuthorizedMerchant returns an error if signature is denied", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
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
    const result = await repo.addAuthorizedMerchant(merchantUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantValidationError);
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("addAuthorizedMerchant returns an error if connector can not be activated", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ceramicUtils.readRecord(AuthorizedMerchantsSchema.title),
    ).thenReturn(okAsync(null));

    const authorizedMerchantEntry = [
      {
        merchantUrl: merchantUrl,
        authorizationSignature: newAuthorizationSignature,
      },
    ];

    td.when(
      mocks.ceramicUtils.writeRecord<IAuthorizedMerchantEntry[]>(
        AuthorizedMerchantsSchema.title,
        authorizedMerchantEntry,
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
    const result = await repo.addAuthorizedMerchant(merchantUrl, balances);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantConnectorError);
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("getMerchantAddresses returns successfully from activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([merchantUrl]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(merchantUrl)).toBe(account);
  });

  test("getMerchantAddresses returns successfully from non-activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl}address`;
        }),
      ),
    ).thenReturn(okAsync(account));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getMerchantAddresses([merchantUrl]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(merchantUrl)).toBe(account);
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
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([merchantUrl, merchantUrl2]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(2);
    expect(value.get(merchantUrl)).toBe(account);
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
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.getMerchantAddresses([merchantUrl, merchantUrl2]);
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const value = result._unsafeUnwrapErr();
    expect(value).toBe(error);
  });

  test("getAuthorizedMerchantConnectorStatus returns map of merchant urls and status", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();
    const resultMap = new Map([[merchantUrl, true]]);

    // Act
    const result = await repo
      .activateAuthorizedMerchants(balances)
      .andThen(() => {
        return repo.getAuthorizedMerchantConnectorStatus();
      });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value).toStrictEqual(resultMap);
  });
});
