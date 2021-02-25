import td, { verify } from "testdouble";
require("testdouble-jest")(td, jest);
import {
  merchantUrl,
  account,
  account2,
  routerChannelAddress,
  insuranceTransferId,
  commonPaymentId,
  mediatorSignature,
  merchantPublicKey,
  merchantUrl2,
  merchantPublicKey2,
} from "@mock/mocks";
import { BlockchainProviderMock, ConfigProviderMock, ContextProviderMock } from "@mock/utils";
import {
  IVectorUtils,
  ILocalStorageUtils,
  IMerchantConnectorProxy,
  IBlockchainUtils,
  IBasicTransferResponse,
} from "@interfaces/utilities";
import { MerchantConnectorError, MerchantValidationError, TransferResolutionError } from "@interfaces/objects/errors";
import { IMerchantConnectorRepository } from "@interfaces/data/IMerchantConnectorRepository";
import { okAsync, errAsync } from "neverthrow";
import { MerchantConnectorRepository } from "@implementations/data/MerchantConnectorRepository";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { IMerchantConnectorProxyFactory } from "@interfaces/utilities/factory";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { BigNumber } from "@interfaces/objects";

const validatedSignature = "0xValidatedSignature";
const newAuthorizationSignature = "0xNewAuthorizationSignature";
const authorizationSignature =
  "0x1e866e66e7f3a68658bd186bafbdc534d4a5022e14022fddfe8865e2236dc67d64eee05b4d8f340dffa1928efa517784b63cad6a3fb35d999cb9d722b34075071b";
const resolutionAmount = "1";

class MerchantConnectorRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public ajaxUtils = td.object<IAjaxUtils>();
  public vectorUtils = td.object<IVectorUtils>();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public merchantConnectorProxyFactory = td.object<IMerchantConnectorProxyFactory>();
  public merchantConnectorProxy = td.object<IMerchantConnectorProxy>();
  public blockchainUtils = td.object<IBlockchainUtils>();

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
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    td.when(
      this.vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        mediatorSignature,
        BigNumber.from(resolutionAmount),
      ),
    ).thenReturn(okAsync({} as IBasicTransferResponse));

    td.when(this.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(
      `[{"merchantUrl":"${merchantUrl}","authorizationSignature":"${authorizationSignature}"}]`,
    );

    td.when(this.merchantConnectorProxyFactory.factoryProxy(merchantUrl)).thenReturn(
      okAsync(this.merchantConnectorProxy),
    );

    td.when(this.merchantConnectorProxy.getValidatedSignature()).thenReturn(okAsync(validatedSignature));
    td.when(this.merchantConnectorProxy.activateConnector()).thenReturn(okAsync(undefined));
    td.when(this.merchantConnectorProxy.resolveChallenge(commonPaymentId)).thenReturn(
      okAsync({ mediatorSignature, amount: resolutionAmount } as IResolutionResult),
    );
    td.when(this.merchantConnectorProxy.getPublicKey()).thenReturn(okAsync(merchantPublicKey));

    td.when(
      this.blockchainUtils.verifyTypedData(
        td.matchers.contains(this.expectedSignerDomain),
        td.matchers.contains(this.expectedSignerTypes),
        td.matchers.contains(this.expectedSignerValue),
        authorizationSignature,
      ),
    ).thenReturn(account);

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
      this.localStorageUtils,
      this.merchantConnectorProxyFactory,
      this.blockchainUtils,
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

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);

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
    const result = await repo.activateAuthorizedMerchants();

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
        authorizationSignature,
      ),
    ).thenReturn(account2);

    let onAuthorizedMerchantUpdatedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantUpdated.subscribe((val) => {
      onAuthorizedMerchantUpdatedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    verify(
      mocks.localStorageUtils.setItem(
        "AuthorizedMerchants",
        `[{"merchantUrl":"${merchantUrl}","authorizationSignature":"${newAuthorizationSignature}"}]`,
      ),
    );
    expect(onAuthorizedMerchantUpdatedVal).toBeDefined();
    expect(onAuthorizedMerchantUpdatedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants returns an error if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new MerchantConnectorError();
    td.when(mocks.merchantConnectorProxyFactory.factoryProxy(merchantUrl)).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants returns an error if one of the merchant connector's signatures can't be verified by the iFrame.", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new MerchantValidationError();
    td.when(mocks.merchantConnectorProxy.getValidatedSignature()).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBe(error);
    verify(mocks.merchantConnectorProxy.destroy());
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("activateAuthorizedMerchants returns an error if the connector can not be activated", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new MerchantConnectorError();
    td.when(mocks.merchantConnectorProxy.activateConnector()).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBe(error);
    verify(mocks.merchantConnectorProxy.destroy());
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("resolveChallenge returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.resolveChallenge(merchantUrl, commonPaymentId, insuranceTransferId);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
  });

  test("resolveChallenge returns an error if merchant is not activated", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.resolveChallenge(merchantUrl, commonPaymentId, insuranceTransferId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(MerchantValidationError);
  });

  test("resolveChallenge returns an error if the merchant connector resolveChallenge fails", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(mocks.merchantConnectorProxy.resolveChallenge(commonPaymentId)).thenReturn(
      errAsync(new MerchantConnectorError()),
    );
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.resolveChallenge(merchantUrl, commonPaymentId, insuranceTransferId);
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
        mediatorSignature,
        BigNumber.from(resolutionAmount),
      ),
    ).thenReturn(errAsync(new TransferResolutionError()));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.resolveChallenge(merchantUrl, commonPaymentId, insuranceTransferId);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TransferResolutionError);
  });

  test("addAuthorizedMerchant returns successfully", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    verify(
      mocks.localStorageUtils.setItem(
        "AuthorizedMerchants",
        `[{"merchantUrl":"${merchantUrl}","authorizationSignature":"${newAuthorizationSignature}"}]`,
      ),
    );
  });

  test("addAuthorizedMerchant returns an error if proxy can not be factoried", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);
    const error = new MerchantConnectorError();
    td.when(mocks.merchantConnectorProxyFactory.factoryProxy(merchantUrl)).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl);

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

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);

    const error = new MerchantValidationError();
    td.when(mocks.merchantConnectorProxy.getValidatedSignature()).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl);

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

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);

    const error = new MerchantValidationError();
    td.when(
      mocks.blockchainProvider.signer._signTypedData(
        td.matchers.contains(mocks.expectedSignerDomain),
        td.matchers.contains(mocks.expectedSignerTypes),
        td.matchers.contains(mocks.expectedSignerValue),
      ),
    ).thenReject(error);

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl);

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

    td.when(mocks.localStorageUtils.getItem("AuthorizedMerchants")).thenReturn(null);

    const error = new MerchantConnectorError();
    td.when(mocks.merchantConnectorProxy.activateConnector()).thenReturn(errAsync(error));

    let onAuthorizedMerchantActivationFailedVal: string | null = null;
    mocks.contextProvider.onAuthorizedMerchantActivationFailed.subscribe((val) => {
      onAuthorizedMerchantActivationFailedVal = val.toString();
    });

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.addAuthorizedMerchant(merchantUrl);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultVal = result._unsafeUnwrapErr();
    expect(resultVal).toBeInstanceOf(MerchantConnectorError);
    expect(resultVal).toBe(error);
    expect(onAuthorizedMerchantActivationFailedVal).toBe(merchantUrl);
  });

  test("getMerchantPublicKeys returns successfully from activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();
    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.getMerchantPublicKeys([merchantUrl]);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(merchantUrl)).toBe(merchantPublicKey);
  });

  test("getMerchantPublicKeys returns successfully from non-activated merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl}publicKey`;
        }),
      ),
    ).thenReturn(okAsync(merchantPublicKey));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.getMerchantPublicKeys([merchantUrl]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(1);
    expect(value.get(merchantUrl)).toBe(merchantPublicKey);
  });

  test("getMerchantPublicKeys returns successfully from both types of merchants", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl2}publicKey`;
        }),
      ),
    ).thenReturn(okAsync(merchantPublicKey2));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.getMerchantPublicKeys([merchantUrl, merchantUrl2]);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const value = result._unsafeUnwrap();
    expect(value.size).toBe(2);
    expect(value.get(merchantUrl)).toBe(merchantPublicKey);
    expect(value.get(merchantUrl2)).toBe(merchantPublicKey2);
  });

  test("getMerchantPublicKeys returns an error if a single merchant has an error", async () => {
    // Arrange
    const mocks = new MerchantConnectorRepositoryMocks();

    const error = new Error();
    td.when(
      mocks.ajaxUtils.get(
        td.matchers.argThat((arg: URL) => {
          return arg.toString() == `${merchantUrl2}publicKey`;
        }),
      ),
    ).thenReturn(errAsync(error));

    const repo = mocks.factoryRepository();

    // Act
    const result = await repo.activateAuthorizedMerchants().andThen(() => {
      return repo.getMerchantPublicKeys([merchantUrl, merchantUrl2]);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const value = result._unsafeUnwrapErr();
    expect(value).toBe(error);
  });
});
