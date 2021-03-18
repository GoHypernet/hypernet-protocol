import { okAsync } from "neverthrow";
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
  });
});
