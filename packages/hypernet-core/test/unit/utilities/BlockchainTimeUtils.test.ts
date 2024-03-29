import { UnixTimestamp } from "@hypernetlabs/objects";
import { ITimeUtils } from "@hypernetlabs/utils";
import td from "testdouble";

import { BlockchainTimeUtils } from "@implementations/utilities";
import { IBlockchainTimeUtils } from "@interfaces/utilities";
import { BlockchainProviderMock } from "@mock/utils";

class BlockchainTimeUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public timeUtils = td.object<ITimeUtils>();
  constructor() {
    td.when(this.timeUtils.getUnixNow()).thenReturn(
      UnixTimestamp(Math.floor(Date.now() / 1000)) as never,
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
