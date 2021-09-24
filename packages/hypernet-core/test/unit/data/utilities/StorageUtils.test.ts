import { PersistenceError } from "@hypernetlabs/objects";
import { ILocalStorageUtils, ILogUtils } from "@hypernetlabs/utils";
import { errAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { StorageUtils } from "@implementations/data/utilities";
import { IStorageUtils } from "@interfaces/data/utilities";
import { ICeramicUtils } from "@interfaces/utilities";
import { ContextProviderMock } from "@mock/utils";

class StorageUtilsMocks {
  public contextProvider = new ContextProviderMock();
  public ceramicUtils = td.object<ICeramicUtils>();
  public localStorageUtils = td.object<ILocalStorageUtils>();
  public logUtils = td.object<ILogUtils>();
  public exampleKey = "key";
  public exampleData = {
    "1": 1,
    "2": {
      "2": 2,
    },
  };
  public jsonData = JSON.stringify(this.exampleData);
  constructor() {
    td.when(this.localStorageUtils.getSessionItem(this.exampleKey)).thenReturn(
      this.jsonData,
    );

    td.when(
      this.ceramicUtils.writeRecord(this.exampleKey, this.exampleData),
    ).thenReturn(okAsync(undefined));

    td.when(this.ceramicUtils.removeRecord(this.exampleKey)).thenReturn(
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
  test("StorageUtils.write writes data to both session storage and Ceramic", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    // Act
    const result = await utils.write(mocks.exampleKey, mocks.exampleData);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    td.verify(
      mocks.localStorageUtils.setSessionItem(mocks.exampleKey, mocks.jsonData),
    );

    mocks.contextProvider.assertEventCounts({});
  });

  test("StorageUtils.write returns an error if Ceramic fails, still writes to the session", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    const err = new PersistenceError();
    td.when(
      mocks.ceramicUtils.writeRecord(mocks.exampleKey, mocks.exampleData),
    ).thenReturn(errAsync(err));

    // Act
    const result = await utils.write(mocks.exampleKey, mocks.exampleData);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultErr = result._unsafeUnwrapErr();
    expect(resultErr).toBeInstanceOf(PersistenceError);
    expect(resultErr).toBe(err);

    td.verify(
      mocks.localStorageUtils.setSessionItem(mocks.exampleKey, mocks.jsonData),
    );

    mocks.contextProvider.assertEventCounts({
      onCeramicFailed: 1,
    });
  });

  test("StorageUtils.read returns data from Session Storage if it exists", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    // Act
    const result = await utils.read(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const resultData = result._unsafeUnwrap();
    expect(resultData).toMatchObject(mocks.exampleData);

    td.verify(mocks.ceramicUtils.readRecord(mocks.exampleKey), { times: 0 });

    mocks.contextProvider.assertEventCounts({});
  });

  test("StorageUtils.read returns data from Ceramic if Session Storage does not exist", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    td.when(
      mocks.localStorageUtils.getSessionItem(mocks.exampleKey),
    ).thenReturn(null);

    td.when(mocks.ceramicUtils.readRecord(mocks.exampleKey)).thenReturn(
      okAsync(mocks.exampleData),
    );

    // Act
    const result = await utils.read(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const resultData = result._unsafeUnwrap();
    expect(resultData).toMatchObject(mocks.exampleData);

    mocks.contextProvider.assertEventCounts({});

    td.verify(
      mocks.localStorageUtils.setSessionItem(mocks.exampleKey, mocks.jsonData),
      { times: 1 },
    );
  });

  test("StorageUtils.read returns null and doesn't write if both sesison and Ceramic return null", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    td.when(
      mocks.localStorageUtils.getSessionItem(mocks.exampleKey),
    ).thenReturn(null);

    td.when(mocks.ceramicUtils.readRecord(mocks.exampleKey)).thenReturn(
      okAsync(null),
    );

    // Act
    const result = await utils.read(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const resultData = result._unsafeUnwrap();
    expect(resultData).toBeNull();

    mocks.contextProvider.assertEventCounts({});

    td.verify(
      mocks.localStorageUtils.setSessionItem(mocks.exampleKey, mocks.jsonData),
      { times: 0 },
    );
  });

  test("StorageUtils.read returns an error if Ceramic fails", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    td.when(
      mocks.localStorageUtils.getSessionItem(mocks.exampleKey),
    ).thenReturn(null);

    const err = new PersistenceError();
    td.when(mocks.ceramicUtils.readRecord(mocks.exampleKey)).thenReturn(
      errAsync(err),
    );

    // Act
    const result = await utils.read(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultErr = result._unsafeUnwrapErr();
    expect(resultErr).toBeInstanceOf(PersistenceError);
    expect(resultErr).toBe(err);

    mocks.contextProvider.assertEventCounts({ onCeramicFailed: 1 });

    td.verify(
      mocks.localStorageUtils.setSessionItem(mocks.exampleKey, mocks.jsonData),
      { times: 0 },
    );
  });

  test("StorageUtils.remove removes data from both session and Ceramic", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    // Act
    const result = await utils.remove(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    td.verify(mocks.localStorageUtils.removeSessionItem(mocks.exampleKey), {
      times: 1,
    });

    mocks.contextProvider.assertEventCounts({});
  });

  test("StorageUtils.remove returns an error is Ceramic fails", async () => {
    // Arrange
    const mocks = new StorageUtilsMocks();
    const utils = mocks.factoryStorageUtils();

    const err = new PersistenceError();
    td.when(mocks.ceramicUtils.removeRecord(mocks.exampleKey)).thenReturn(
      errAsync(err),
    );

    // Act
    const result = await utils.remove(mocks.exampleKey);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const resultErr = result._unsafeUnwrapErr();
    expect(resultErr).toBeInstanceOf(PersistenceError);
    expect(resultErr).toBe(err);

    td.verify(mocks.localStorageUtils.removeSessionItem(mocks.exampleKey), {
      times: 1,
    });

    mocks.contextProvider.assertEventCounts({
      onCeramicFailed: 1,
    });
  });
});
