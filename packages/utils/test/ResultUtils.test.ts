import { errAsync, okAsync } from "neverthrow";

import { ResultUtils } from "../src/ResultUtils";

describe("ResultUtils tests", () => {
  test("executeSerially executes resultAsyncs sequentially", async () => {
    // Arrange
    let value = 0;
    const asyncMethod = () => {
      return okAsync<number, Error>(value++);
    };

    // Act
    const result = await ResultUtils.executeSerially([
      asyncMethod,
      asyncMethod,
      asyncMethod,
    ]);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const results = result._unsafeUnwrap();
    expect(results).toStrictEqual([0, 1, 2]);
    expect(value).toBe(3);
  });

  test("executeSerially stops executing after first error", async () => {
    // Arrange
    let value = 0;
    const asyncMethod = () => {
      return okAsync<number, Error>(value++);
    };

    const err = new Error("Error!");
    const asyncFailed = () => {
      return errAsync<number, Error>(err);
    };

    // Act
    const result = await ResultUtils.executeSerially([
      asyncMethod,
      asyncFailed,
      asyncMethod,
    ]);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const resultErr = result._unsafeUnwrapErr();
    expect(resultErr).toBe(err);
    expect(value).toBe(1);
  });

  test("backoffAndRetry works first time", async () => {
    // Arrange
    let value = 1;
    const asyncMethod = () => {
      return okAsync<number, Error>(value++);
    };

    // Act
    const result = await ResultUtils.backoffAndRetry(asyncMethod, [], 10, 1);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const results = result._unsafeUnwrap();
    expect(results).toStrictEqual(1);
    expect(value).toBe(2);
  });

  test("backoffAndRetry works second time", async () => {
    // Arrange
    let value = 1;
    const asyncMethod = () => {
      if (value++ == 1) {
        return errAsync(new Error());
      }
      return okAsync<number, Error>(value++);
    };

    // Act
    const result = await ResultUtils.backoffAndRetry(
      asyncMethod,
      [Error],
      10,
      1,
    );

    // Assert
    expect(result.isErr()).toBeFalsy();
    const results = result._unsafeUnwrap();
    expect(results).toBe(3);
    expect(value).toBe(4);
  });

  test("backoffAndRetry max retries exceeded", async () => {
    // Arrange
    let value = 0;
    const err = new Error();
    const asyncMethod = () => {
      value++;
      return errAsync(err);
    };

    // Act
    const result = await ResultUtils.backoffAndRetry(
      asyncMethod,
      [Error],
      3,
      1,
    );

    // Assert
    expect(result.isErr()).toBeTruthy();
    const results = result._unsafeUnwrapErr();
    expect(results).toBe(err);
    expect(value).toBe(3);
  });

  test("backoffAndRetry unnaceptable error returned", async () => {
    // Arrange
    let value = 0;
    const err = new Error();
    const syncMethod = () => {
      value++;
      return errAsync(err);
    };

    // Act
    const result = await ResultUtils.backoffAndRetry(syncMethod, [], 10, 1);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const results = result._unsafeUnwrapErr();
    expect(results).toBe(err);
    expect(value).toBe(1);
  });

  test("fromThrowableResult return result in ideal case", async () => {
    // Arrange
    const syncMethod = (): number => {
      return 1;
    };

    // Act
    const result = await ResultUtils.fromThrowableResult<number, Error>(
      syncMethod,
    );

    // Assert
    expect(result.isErr()).toBeFalsy();
    const resultValue = result._unsafeUnwrap();
    expect(resultValue).toBe(1);
  });

  test("fromThrowableResult return error result if funtion throw an error", async () => {
    // Arrange
    const err = new Error();
    const syncMethod = (): number => {
      throw err;
    };

    // Act
    const result = await ResultUtils.fromThrowableResult<number, Error>(
      syncMethod,
    );

    // Assert
    expect(result.isErr()).toBeTruthy();
    const results = result._unsafeUnwrapErr();
    expect(results).toBe(err);
  });
});
