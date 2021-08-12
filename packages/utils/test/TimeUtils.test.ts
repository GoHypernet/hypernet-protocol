import { UnixTimestamp } from "@hypernetlabs/objects";

import moment from "moment";
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
    const t1 = UnixTimestamp(moment().unix());

    // Act
    const result = timeUtils.getUnixNow();
    const t2 = UnixTimestamp(moment().unix());

    // Assert
    expect(result).toBeGreaterThanOrEqual(t1);
    expect(result).toBeLessThanOrEqual(t2);
  });
});
