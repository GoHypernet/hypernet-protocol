import { ETransferState } from "@hypernetlabs/objects";
import { ILogUtils, ITimeUtils } from "@hypernetlabs/utils";
import {
  activeParameterizedTransfer,
  canceledInsuranceTransfer,
  canceledOfferTransfer,
  canceledParameterizedTransfer,
  defaultGovernanceChainInformation,
  insuranceTransferEncodedCancel,
  insuranceTransferResolverEncoding,
  messageTransferEncodedCancel,
  messageTransferResolverEncoding,
  parameterizedTransferEncodedCancel,
  parameterizedTransferResolverEncoding,
  resolvedInsuranceTransfer,
  resolvedOfferTransfer,
  resolvedParameterizedTransfer,
  unixNow,
} from "@mock/mocks";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { VectorUtils } from "@implementations/utilities/VectorUtils";
import {
  IBlockchainTimeUtils,
  IBlockchainUtils,
  IPaymentIdUtils,
} from "@interfaces/utilities";
import {
  ConfigProviderMock,
  ContextProviderMock,
  BlockchainProviderMock,
  BrowserNodeProviderMock,
} from "@mock/utils";

class VectorUtilsMocks {
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider: BrowserNodeProviderMock;
  public blockchainProvider = new BlockchainProviderMock();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public paymentIdUtils = td.object<IPaymentIdUtils>();
  public logUtils = td.object<ILogUtils>();
  public timeUtils = td.object<ITimeUtils>();
  public blockchainTimeUtils = td.object<IBlockchainTimeUtils>();

  constructor(includeExistingStateChannel = true) {
    this.browserNodeProvider = new BrowserNodeProviderMock(
      true,
      true,
      true,
      null,
      includeExistingStateChannel,
    );
    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow as never);
    td.when(this.blockchainTimeUtils.getBlockchainTimestamp()).thenReturn(
      okAsync(unixNow),
    );

    td.when(
      this.blockchainUtils.getMessageTransferEncodedCancelData(
        defaultGovernanceChainInformation,
      ),
    ).thenReturn(
      okAsync([messageTransferResolverEncoding, messageTransferEncodedCancel]),
    );
    td.when(
      this.blockchainUtils.getInsuranceTransferEncodedCancelData(
        defaultGovernanceChainInformation,
      ),
    ).thenReturn(
      okAsync([
        insuranceTransferResolverEncoding,
        insuranceTransferEncodedCancel,
      ]),
    );
    td.when(
      this.blockchainUtils.getParameterizedTransferEncodedCancelData(
        defaultGovernanceChainInformation,
      ),
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
  // test("initialize completes successfully", async () => {
  //   // Arrange
  //   const vectorUtilsMocks = new VectorUtilsMocks();

  //   const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

  //   // Act
  //   const result = await vectorUtils.initialize();

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isOk()).toBeTruthy();
  // });

  // test("initialize creates a channel with the router if the channel does not exist", async () => {
  //   // Arrange
  //   const vectorUtilsMocks = new VectorUtilsMocks(false);

  //   const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

  //   // Act
  //   const result = await vectorUtils.initialize();

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isOk()).toBeTruthy();
  // });

  // test("initialize restores a channel with the router when setup fails", async () => {
  //   // Arrange
  //   const vectorUtilsMocks = new VectorUtilsMocks(false);

  //   td.when(
  //     vectorUtilsMocks.browserNodeProvider.browserNode.setup(
  //       routerPublicIdentifier,
  //       chainId,
  //       DEFAULT_CHANNEL_TIMEOUT.toString(),
  //     ),
  //   ).thenReturn(errAsync(new VectorError("Setup Failed")));

  //   const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

  //   // Act
  //   const result = await vectorUtils.initialize();

  //   // Assert
  //   expect(result).toBeDefined();
  //   expect(result.isOk()).toBeTruthy();
  // });

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
