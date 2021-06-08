import { okAsync } from "neverthrow";
import td from "testdouble";

import { StorageUtils } from "@implementations/data/utilities";

import { ICeramicUtils } from "@interfaces/utilities";
import { ILogUtils, ILocalStorageUtils } from "@hypernetlabs/utils";
import { IStorageUtils } from "@interfaces/data/utilities";

import { ContextProviderMock } from "@tests/mock/utils";
import { IAuthorizedMerchantEntry } from "@interfaces/data";
import { merchantUrl, authorizationSignature } from "@mock/mocks";

const authorizaedMerchantsKey = "AuthorizedMerchants";
const authorizaedMerchantsData = [
  {
    merchantUrl: merchantUrl,
    authorizationSignature: authorizationSignature,
  },
];

class StorageUtilsMocks {
  public contextProvider = new ContextProviderMock();
  public ceramicUtils = td.object<ICeramicUtils>();
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    td.when(this.localStorageUtils.getItem(authorizaedMerchantsKey)).thenReturn(
      `[{"merchantUrl":"${merchantUrl}","authorizationSignature":"${authorizationSignature}"}]`,
    );

    td.when(
      this.ceramicUtils.readRecord<IAuthorizedMerchantEntry[]>(
        authorizaedMerchantsKey,
      ),
    ).thenReturn(
      okAsync([
        {
          merchantUrl: merchantUrl,
          authorizationSignature: authorizationSignature,
        },
      ]),
    );

    td.when(
      this.ceramicUtils.writeRecord(
        authorizaedMerchantsKey,
        authorizaedMerchantsData,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(this.ceramicUtils.removeRecord(authorizaedMerchantsKey)).thenReturn(
      okAsync(undefined),
    );
  }

  public factoryStorageUtils(): IStorageUtils {
    return new StorageUtils(
      this.contextProvider,
      this.ceramicUtils,
      this.localStorageUtils,
      this.logUtils,
    );
  }
}

describe("StorageUtils tests", () => {
  test("StorageUtils writes data using only localstorage when metamask is not installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = false;

    // Act
    const writeResult = await utils.write<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
      authorizaedMerchantsData,
    );

    const readResult = await utils.read<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
    );

    const ceramicWriteRecordCallingcount = td.explain(
      mocks.ceramicUtils.writeRecord,
    ).callCount;

    // Assert
    expect(writeResult).toBeDefined();
    expect(writeResult.isErr()).toBeFalsy();
    expect(readResult).toBeDefined();
    expect(readResult.isErr()).toBeFalsy();
    const authorizedMerchants = readResult._unsafeUnwrap();
    if (authorizedMerchants == null) {
      throw new Error("couldn't retrieve authorizedMerchants");
    }
    expect(authorizedMerchants?.length).toBe(1);
    expect(authorizedMerchants[0].authorizationSignature).toBe(
      authorizationSignature,
    );
    expect(ceramicWriteRecordCallingcount).toBe(0);
  });

  test("StorageUtils writes data using ceramic and localstorage when metamask is installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = true;

    // Act
    const writeResult = await utils.write<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
      authorizaedMerchantsData,
    );

    const readResult = await utils.read<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
    );

    const ceramicWriteRecordCallingcount = td.explain(
      mocks.ceramicUtils.writeRecord,
    ).callCount;

    // Assert
    expect(writeResult).toBeDefined();
    expect(writeResult.isErr()).toBeFalsy();
    expect(readResult).toBeDefined();
    expect(readResult.isErr()).toBeFalsy();
    const authorizedMerchants = readResult._unsafeUnwrap();
    if (authorizedMerchants == null) {
      throw new Error("couldn't retrieve authorizedMerchants");
    }
    expect(authorizedMerchants?.length).toBe(1);
    expect(authorizedMerchants[0].authorizationSignature).toBe(
      authorizationSignature,
    );
    expect(ceramicWriteRecordCallingcount).toBe(1);
  });

  test("StorageUtils reads data using only localstorage when metamask is not installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = false;

    // Act
    const readResult = await utils.read<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
    );

    const ceramicReadRecordCallingcount = td.explain(
      mocks.ceramicUtils.readRecord,
    ).callCount;

    // Assert
    expect(readResult).toBeDefined();
    expect(readResult.isErr()).toBeFalsy();
    const authorizedMerchants = readResult._unsafeUnwrap();
    if (authorizedMerchants == null) {
      throw new Error("couldn't retrieve authorizedMerchants");
    }
    expect(authorizedMerchants?.length).toBe(1);
    expect(authorizedMerchants[0].authorizationSignature).toBe(
      authorizationSignature,
    );
    expect(ceramicReadRecordCallingcount).toBe(0);
  });

  test("StorageUtils reads data using ceramic and localstorage when metamask is installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = true;

    // Act
    const readResult = await utils.read<IAuthorizedMerchantEntry[]>(
      authorizaedMerchantsKey,
    );

    const ceramicReadRecordCallingcount = td.explain(
      mocks.ceramicUtils.readRecord,
    ).callCount;

    // Assert
    expect(readResult).toBeDefined();
    expect(readResult.isErr()).toBeFalsy();
    const authorizedMerchants = readResult._unsafeUnwrap();
    if (authorizedMerchants == null) {
      throw new Error("couldn't retrieve authorizedMerchants");
    }
    expect(authorizedMerchants?.length).toBe(1);
    expect(authorizedMerchants[0].authorizationSignature).toBe(
      authorizationSignature,
    );
    expect(ceramicReadRecordCallingcount).toBe(1);
  });

  test("StorageUtils removes data using only localstorage when metamask is not installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = false;

    // Act
    const removeResult = await utils.remove(authorizaedMerchantsKey);

    const ceramicReadRecordCallingcount = td.explain(
      mocks.ceramicUtils.removeRecord,
    ).callCount;

    // Assert
    expect(removeResult).toBeDefined();
    expect(removeResult.isErr()).toBeFalsy();
    expect(removeResult._unsafeUnwrap()).toBeUndefined();
    expect(ceramicReadRecordCallingcount).toBe(0);
  });

  test("StorageUtils removes data using only localstorage when metamask is not installed", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();
    mocks.contextProvider.context.metamaskEnabled = true;

    // Act
    const removeResult = await utils.remove(authorizaedMerchantsKey);

    const ceramicReadRecordCallingcount = td.explain(
      mocks.ceramicUtils.removeRecord,
    ).callCount;

    // Assert
    expect(removeResult).toBeDefined();
    expect(removeResult.isErr()).toBeFalsy();
    expect(removeResult._unsafeUnwrap()).toBeUndefined();
    expect(ceramicReadRecordCallingcount).toBe(1);
  });
});
