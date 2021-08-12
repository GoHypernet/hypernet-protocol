import td from "testdouble";
import { UnixTimestamp } from "@hypernetlabs/objects";
import { BlockchainTimeUtils } from "@implementations/utilities";
import { IBlockchainTimeUtils } from "@interfaces/utilities";

import { BlockchainProviderMock } from "@mock/utils";
import moment from "moment";
import { ITimeUtils } from "@hypernetlabs/utils";

class BlockchainTimeUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public timeUtils = td.object<ITimeUtils>();
  constructor() {
    td.when(this.timeUtils.getUnixNow()).thenReturn(
      UnixTimestamp(moment().unix()) as never,
    );
  }

  public factoryTimeUtils(): IBlockchainTimeUtils {
    return new BlockchainTimeUtils(this.blockchainProvider, this.timeUtils);
  }
}

describe("BlockchainTimeUtils tests", () => {
  test("getBlockchainTimestamp should return lastBlockchainTimestamp", () => {
    // Arrange
    const blockchainTimeUtilsMocks = new BlockchainTimeUtilsMocks();
    const timeUtils = blockchainTimeUtilsMocks.factoryTimeUtils();

    // Act
    const result = timeUtils.getBlockchainTimestamp();

    // Assert
    expect(result).toBeDefined();
  });
});
