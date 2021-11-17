import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { ResultUtils } from "@utils/ResultUtils";

describe("ResultUtils tests", () => {
  test("combine returns after each method completes", async () => {
    // Arrange
    let value = 0;
    function asyncMethod() {
      return okAsync<number, Error>(value++);
    }

    // Act
    const result = await ResultUtils.combine([
      asyncMethod(),
      asyncMethod(),
      asyncMethod(),
    ]);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const results = result._unsafeUnwrap();
    expect(results).toStrictEqual([0, 1, 2]);
    expect(value).toBe(3);
  });

  test("combine returns an error if one method fails", async () => {
    // Arrange
    let value = 0;
    function asyncMethod() {
      return okAsync<number, Error>(value++);
    }

    const err = new Error();
    function errorMethod() {
      return errAsync<number, Error>(err);
    }

    // Act
    const result = await ResultUtils.combine([
      asyncMethod(),
      errorMethod(),
      asyncMethod(),
    ]);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const errResult = result._unsafeUnwrapErr();
    expect(errResult).toBe(err);
  });

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

  test("race returns the first resolved Promise value", async () => {
    // Arrange
    let value = 0;
    const timedPromise = new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        value = 2;
        resolve(2);
      }, 500);
    });
    const timedResult = ResultAsync.fromPromise(
      timedPromise,
      (e) => e as Error,
    );
    const asyncMethod = () => {
      return okAsync<number, Error>(value++);
    };

    // Act
    const result = await ResultUtils.race([timedResult, asyncMethod()]);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const resultWrap = result._unsafeUnwrap();
    expect(resultWrap).toStrictEqual(0);
    expect(value).toBe(1);
  });

  test("race stops at the first resolved promise", async () => {
    // Arrange
    let value = 0;
    const timedPromise = new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        value = 1;
        resolve(1);
      }, 500);
    });
    const timedResult = ResultAsync.fromPromise(
      timedPromise,
      (e) => e as Error,
    );

    const timedPromise2 = new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        resolve(2);
      }, 100);
    });
    const timedResult2 = ResultAsync.fromPromise(
      timedPromise2,
      (e) => e as Error,
    );

    // Act
    const result = await ResultUtils.race([timedResult, timedResult2]);

    // Assert
    expect(result.isErr()).toBeFalsy();
    const resultWrap = result._unsafeUnwrap();
    expect(resultWrap).toStrictEqual(2);
    expect(value).toBe(0);
  });

  test("filter() returns successfully when no callback has errors", async () => {
    // Arrange
    const sourceArr = [1, 2, 3, 4, 5, 6];

    // Act
    const result = await ResultUtils.filter<number, Error>(sourceArr, (val) => {
      if (val < 3) {
        return okAsync(true);
      }
      return okAsync(false);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const filteredResults = result._unsafeUnwrap();
    expect(filteredResults.length).toBe(2);
    expect(filteredResults).toStrictEqual([1, 2]);
  });

  test("filter() returns an error when a single callback has errors", async () => {
    // Arrange
    const sourceArr = [1, 2, 3, 4, 5, 6];

    // Act
    const result = await ResultUtils.filter<number, Error>(sourceArr, (val) => {
      if (val > 3) {
        return errAsync(new Error());
      }
      return okAsync(false);
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
  });

  test("map() returns successfully when no callback has errors", async () => {
    // Arrange
    const sourceArr = [1, 2, 3, 4, 5, 6];

    // Act
    const result = await ResultUtils.map(sourceArr, (val) => {
      return okAsync<string, Error>((val * 10).toString());
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isOk()).toBeTruthy();
    const filteredResults = result._unsafeUnwrap();
    expect(filteredResults.length).toBe(6);
    expect(filteredResults).toStrictEqual(["10", "20", "30", "40", "50", "60"]);
  });

  test("map() returns an error when a single callback has errors", async () => {
    // Arrange
    const sourceArr = [1, 2, 3, 4, 5, 6];

    // Act
    const result = await ResultUtils.map(sourceArr, (val) => {
      if (val > 3) {
        return errAsync(new Error());
      }
      return okAsync<string, Error>((val * 10).toString());
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
  });
});
