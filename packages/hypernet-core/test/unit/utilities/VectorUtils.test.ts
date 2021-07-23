import {
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

  test("getTransferWasCanceled returns false for a non-resolved transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(
      vectorUtilsMocks.browserNodeProvider.parameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(false);
  });

  test("getTransferWasCanceled returns true for a canceled Message Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const messageTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: messageTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: { message: "" } as MessageResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(messageTransfer);

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(true);
  });

  test("getTransferWasCanceled returns false for a Message transfer resolved as anything", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const messageTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: messageTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: { message: "Reply" } as MessageResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(messageTransfer);

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(false);
  });

  test("getTransferWasCanceled returns true for a canceled Insurance Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const insuranceTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: insuranceTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: {
        data: {
          amount:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
        signature:
          "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      } as InsuranceResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(insuranceTransfer);

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(true);
  });

  test("getTransferWasCanceled returns false for an Insurance transfer resolved for 0", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const insuranceTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: insuranceTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: {
        data: {
          amount:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          UUID: "0x0000000000000000000000000000000000000000000000000000000000000001",
        },
        signature:
          "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
      } as InsuranceResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(insuranceTransfer);

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(false);
  });

  test("getTransferWasCanceled returns true for a canceled Parameterized Transfer", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const parameterizedTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: parameterizedTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: {
        data: {
          paymentAmountTaken:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          UUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        },
        payeeSignature:
          "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      } as ParameterizedResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(
      parameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(true);
  });

  test("getTransferWasCanceled returns false for a Parameterized transfer resolved for 0", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const parameterizedTransfer: IFullTransferState<MessageState> = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: offerTransferId,
      transferDefinition: parameterizedTransferDefinitionAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: publicIdentifier,
      responder: publicIdentifier2,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        message: "",
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier2,
      transferResolver: {
        data: {
          paymentAmountTaken:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          UUID: "0x0000000000000000000000000000000000000000000000000000000000000001",
        },
        payeeSignature:
          "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
      } as ParameterizedResolver,
    };

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getTransferWasCanceled(
      parameterizedTransfer,
    );

    // Assert
    expect(result.isOk).toBeTruthy();
    const canceled = result._unsafeUnwrap();

    expect(canceled).toBe(false);
  });
});
