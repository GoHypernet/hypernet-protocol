import { UnixTimestamp } from "@hypernetlabs/objects";
import { ITimeUtils, TimeUtils } from "@hypernetlabs/utils";

const unixNow = UnixTimestamp(1318874398);

jest.mock("moment", () => {
  let mockMoment = {};
  Object.keys(jest.requireActual("moment")).forEach((key) => {
    mockMoment = {
      ...mockMoment,
      [key]: jest.requireActual("moment")[key],
    };
  });
  return {
    ...mockMoment,
    moment: {
      unix: () => unixNow,
    },
  };
});
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

    // Act
    const result = timeUtils.getUnixNow();

    // Assert
    expect(result).toBe(unixNow);
  });
});
