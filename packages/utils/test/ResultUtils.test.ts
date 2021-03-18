import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "../src/ResultUtils";

describe("ResultUtils tests", () => {
  
  test("executeSerially executes resultAsyncs sequentially", async () => {
    // Arrange
    let value = 0;
    const asyncMethod = () => {
        return okAsync<number, Error>(value++);
    }

    // Act
    const result = await ResultUtils.executeSerially([asyncMethod, asyncMethod, asyncMethod]);

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
    }

    const err = new Error("Error!");
    const asyncFailed = () => {
      return errAsync<number, Error>(err);
  }

    // Act
    const result = await ResultUtils.executeSerially([asyncMethod, asyncFailed, asyncMethod]);

    // Assert
    expect(result.isErr()).toBeTruthy();
    const resultErr = result._unsafeUnwrapErr();
    expect(resultErr).toBe(err);
    expect(value).toBe(1);
  });
});
