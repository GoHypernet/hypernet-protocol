import { ITimeUtils, TimeUtils } from "@hypernetlabs/utils";

class TimeUtilsMocks {
  constructor() {}

  public factoryTimeUtils(): ITimeUtils {
    return new TimeUtils();
  }
}

describe("TimeUtils tests", () => {
  test("getUnixNow should return time range", () => {
    // Arrange
    const timeUtilsMocks = new TimeUtilsMocks();
    const timeUtils = timeUtilsMocks.factoryTimeUtils();

    jest.spyOn(global.Date, "now").mockImplementationOnce(() => {
      return 1318874398000;
    });

    // Act
    const result = timeUtils.getUnixNow();

    // Assert
    expect(result).toBe(1318874398);
  });
});
