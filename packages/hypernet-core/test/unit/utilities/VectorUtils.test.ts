import { VectorUtils } from "@implementations/utilities/VectorUtils";
import { ConfigProviderMock, ContextProviderMock, BlockchainProviderMock, createBrowserNodeMock } from "@mock/utils";
import { routerChannelAddress, unixNow } from "@mock/mocks";
import td from "testdouble";
import { IBrowserNode, IBrowserNodeProvider, IPaymentIdUtils, ITimeUtils } from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync } from "neverthrow";

class VectorUtilsMocks {
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  public blockchainProvider = new BlockchainProviderMock();
  public paymentIdUtils = td.object<IPaymentIdUtils>();
  public logUtils = td.object<ILogUtils>();
  public browserNodeMock: IBrowserNode;
  public timeUtils = td.object<ITimeUtils>();

  constructor(includeExistingStateChannels: boolean = true) {
    this.browserNodeMock = createBrowserNodeMock(includeExistingStateChannels ? null : []);
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(this.browserNodeMock));

    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow);
    td.when(this.timeUtils.getBlockchainTimestamp()).thenReturn(okAsync(unixNow));
  }

  public factoryVectorUtils(): VectorUtils {
    return new VectorUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.blockchainProvider,
      this.paymentIdUtils,
      this.logUtils,
      this.timeUtils,
    );
  }
}

describe("VectorUtils tests", () => {
  test("getRouterChannelAddress returns address if channel is already created", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getRouterChannelAddress();

    // Assert
    expect(result.isOk).toBeTruthy();
    const retRouterChannelAddress = result._unsafeUnwrap();

    expect(retRouterChannelAddress).toBe(routerChannelAddress);
  });

  test("getRouterChannelAddress creates a channel with the router if the channel does not exist", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks(false);

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getRouterChannelAddress();

    // Assert
    expect(result.isOk).toBeTruthy();
    const retRouterChannelAddress = result._unsafeUnwrap();

    expect(retRouterChannelAddress).toBe(routerChannelAddress);
  });
});
