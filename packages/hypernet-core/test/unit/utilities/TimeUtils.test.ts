import td from "testdouble";
import { UUID, UnixTimestamp } from "@hypernetlabs/objects";

import { BlockchainProviderMock } from "@mock/utils";
import { TimeUtils } from "@implementations/utilities/TimeUtils";
import { ITimeUtils } from "@interfaces/utilities";
import moment from "moment";

class TimeUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  constructor() {}

  public factoryTimeUtils(): ITimeUtils {
    return new TimeUtils(this.blockchainProvider);
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

  test("getBlockchainTimestamp should return lastBlockchainTimestamp", () => {
    // Arrange
    const timeUtilsMocks = new TimeUtilsMocks();
    const timeUtils = timeUtilsMocks.factoryTimeUtils();
    const t1 = UnixTimestamp(moment().unix());

    // Act
    const result = timeUtils.getBlockchainTimestamp();

    // Assert
    expect(result).toBeDefined();
  });
});
