import {
  ETransferState,
  IFullTransferState,
  InsuranceResolver,
  MessageResolver,
  MessageState,
  ParameterizedResolver,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { VectorUtils } from "@implementations/utilities/VectorUtils";
import {
  IBlockchainUtils,
  IBrowserNode,
  IBrowserNodeProvider,
  IPaymentIdUtils,
  ITimeUtils,
} from "@interfaces/utilities";
import {
  activeParameterizedTransfer,
  canceledInsuranceTransfer,
  canceledOfferTransfer,
  canceledParameterizedTransfer,
  destinationAddress,
  erc20AssetAddress,
  insuranceTransferDefinitionAddress,
  insuranceTransferEncodedCancel,
  insuranceTransferResolverEncoding,
  messageTransferDefinitionAddress,
  messageTransferEncodedCancel,
  messageTransferResolverEncoding,
  offerTransferId,
  parameterizedTransferDefinitionAddress,
  parameterizedTransferEncodedCancel,
  parameterizedTransferResolverEncoding,
  publicIdentifier,
  publicIdentifier2,
  resolvedInsuranceTransfer,
  resolvedOfferTransfer,
  resolvedParameterizedTransfer,
  routerChannelAddress,
  unixNow,
} from "@mock/mocks";
import {
  ConfigProviderMock,
  ContextProviderMock,
  BlockchainProviderMock,
  BrowserNodeProviderMock,
} from "@mock/utils";

class VectorUtilsMocks {
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public blockchainProvider = new BlockchainProviderMock();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public paymentIdUtils = td.object<IPaymentIdUtils>();
  public logUtils = td.object<ILogUtils>();
  public timeUtils = td.object<ITimeUtils>();

  constructor() {
    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow as never);
    td.when(this.timeUtils.getBlockchainTimestamp()).thenReturn(
      okAsync(unixNow),
    );

    td.when(
      this.blockchainUtils.getMessageTransferEncodedCancelData(),
    ).thenReturn(
      okAsync([messageTransferResolverEncoding, messageTransferEncodedCancel]),
    );
    td.when(
      this.blockchainUtils.getInsuranceTransferEncodedCancelData(),
    ).thenReturn(
      okAsync([
        insuranceTransferResolverEncoding,
        insuranceTransferEncodedCancel,
      ]),
    );
    td.when(
      this.blockchainUtils.getParameterizedTransferEncodedCancelData(),
    ).thenReturn(
      okAsync([
        parameterizedTransferResolverEncoding,
        parameterizedTransferEncodedCancel,
      ]),
    );
  }

  public factoryVectorUtils(): VectorUtils {
    return new VectorUtils(
      this.configProvider,
      this.contextProvider,
      this.browserNodeProvider,
      this.blockchainProvider,
      this.blockchainUtils,
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
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getRouterChannelAddress();

    // Assert
    expect(result.isOk).toBeTruthy();
    const retRouterChannelAddress = result._unsafeUnwrap();

    expect(retRouterChannelAddress).toBe(routerChannelAddress);
  });

  test("getTransferStateFromTransfer returns Active for a non-resolved transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      activeParameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Active);
  });

  test("getTransferStateFromTransfer returns Canceled for a canceled Message Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      canceledOfferTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Canceled);
  });

  test("getTransferStateFromTransfer returns Resolved for a Message transfer resolved as anything", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      resolvedOfferTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Resolved);
  });

  test("getTransferStateFromTransfer returns Canceled for a canceled Insurance Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      canceledInsuranceTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Canceled);
  });

  test("getTransferStateFromTransfer returns Resolved for an Insurance transfer resolved for 0", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      resolvedInsuranceTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Resolved);
  });

  test("getTransferStateFromTransfer returns Canceled for a canceled Parameterized Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      canceledParameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Canceled);
  });

  test("getTransferStateFromTransfer returns false for a Parameterized transfer resolved for 0", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferStateFromTransfer(
      resolvedParameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const transferState = result._unsafeUnwrap();

    expect(transferState).toBe(ETransferState.Resolved);
  });
});
