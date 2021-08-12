import td from "testdouble";
import { UUID, UnixTimestamp } from "@hypernetlabs/objects";

import { BlockchainProviderMock } from "@mock/utils";
import moment from "moment";
import { ITimeUtils, TimeUtils } from "@hypernetlabs/utils";

class TimeUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
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

  // test("getBlockchainTimestamp should return lastBlockchainTimestamp", () => {
  //   // Arrange
  //   const timeUtilsMocks = new TimeUtilsMocks();
  //   const timeUtils = timeUtilsMocks.factoryTimeUtils();
  //   const t1 = UnixTimestamp(moment().unix());

  //   // Act
  //   const result = timeUtils.getBlockchainTimestamp();

  //   // Assert
  //   expect(result).toBeDefined();
  // });
});
