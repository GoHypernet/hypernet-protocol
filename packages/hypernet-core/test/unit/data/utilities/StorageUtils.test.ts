import { ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import td from "testdouble";

import { StorageUtils } from "@implementations/data/utilities";
import { IStorageUtils } from "@interfaces/data/utilities";
import { ICeramicUtils } from "@interfaces/utilities";
import { ConfigProviderMock, ContextProviderMock } from "@mock/utils";

class StorageUtilsMocks {
  public contextProvider = new ContextProviderMock();
  public ceramicUtils = td.object<ICeramicUtils>();
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public exampleKey = "key";
  public exampleData = {
    "1": 1,
    "2": {
      "2": 2,
    },
  };
  constructor() {
    td.when(this.localStorageUtils.getItem(this.exampleKey)).thenReturn(
      JSON.stringify(this.exampleData),
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
    // Ceramic now is disabled, Remove this comment when we have it enabled again
    // expect(ceramicWriteRecordCallingcount).toBe(1);
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
    // Ceramic now is disabled, Remove this comment when we have it enabled again
    // expect(ceramicReadRecordCallingcount).toBe(1);
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
    // Ceramic now is disabled, Remove this comment when we have it enabled again
    // expect(ceramicReadRecordCallingcount).toBe(1);
  });
});
