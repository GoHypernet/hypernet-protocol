import td from "testdouble";

import { ConfigProviderMock, ContextProviderMock } from "@mock/utils";
import { IStorageUtils } from "@interfaces/data/utilities";
import { StorageUtils } from "@implementations/data/utilities";
import { ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import { ICeramicUtils } from "@interfaces/utilities";

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
  test("write should okAsync", async () => {
    // Arrange
    const storageUtilsMocks = new StorageUtilsMocks();
    const storageUtils = storageUtilsMocks.factoryStorageUtils();

    // Act
    const result = await storageUtils.write(
      storageUtilsMocks.exampleKey,
      storageUtilsMocks.exampleData,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(undefined);
    td.verify(
      storageUtilsMocks.localStorageUtils.setItem(
        storageUtilsMocks.exampleKey,
        JSON.stringify(storageUtilsMocks.exampleData),
      ),
      {
        times: 1,
      },
    );
  });

  test("read should okAsync(data)", async () => {
    // Arrange
    const storageUtilsMocks = new StorageUtilsMocks();
    const storageUtils = storageUtilsMocks.factoryStorageUtils();

    // Act
    const result = await storageUtils.read(storageUtilsMocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(storageUtilsMocks.exampleData);
  });

  test("remove should okAsync(data)", async () => {
    // Arrange
    const storageUtilsMocks = new StorageUtilsMocks();
    const storageUtils = storageUtilsMocks.factoryStorageUtils();

    // Act
    const result = await storageUtils.remove(storageUtilsMocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(undefined);
    td.verify(
      storageUtilsMocks.localStorageUtils.removeItem(
        storageUtilsMocks.exampleKey,
      ),
      {
        times: 1,
      },
    );
  });
});
