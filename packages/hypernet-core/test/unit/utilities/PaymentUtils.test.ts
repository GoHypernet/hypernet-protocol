import {
  EPaymentState,
  EPaymentType,
  UnixTimestamp,
  SortedTransfers,
  PushPayment,
  IHypernetOfferDetails,
  LogicalError,
  PullPayment,
  UUID,
  ETransferState,
} from "@hypernetlabs/objects";
import td from "testdouble";
import { ok, okAsync } from "neverthrow";

import { PaymentUtils } from "@implementations/utilities";
import {
  IPaymentIdUtils,
  ITimeUtils,
  IPaymentUtils,
} from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";
import {
  BlockchainProviderMock,
  ConfigProviderMock,
  VectorUtilsMockFactory,
  BrowserNodeProviderMock,
} from "@mock/utils";
import {
  commonPaymentId,
  defaultExpirationLength,
  unixNow,
  validDomain,
  activeOfferTransfer,
  activeInsuranceTransfer,
  activeParameterizedTransfer,
  erc20AssetAddress,
  canceledOfferTransfer,
} from "@mock/mocks";

const expirationDate = UnixTimestamp(unixNow + defaultExpirationLength);
const sortedTransfers = new SortedTransfers(
  [activeOfferTransfer],
  [activeInsuranceTransfer],
  [activeParameterizedTransfer],
  [],
);
const transfers = [
  activeOfferTransfer,
  activeInsuranceTransfer,
  activeParameterizedTransfer,
];

class PaymentUtilsMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public paymentIdUtils = td.object<IPaymentIdUtils>();
  public timeUtils = td.object<ITimeUtils>();
  public vectorUtils =
    VectorUtilsMockFactory.factoryVectorUtils(expirationDate);
  public browserNodeProvider = new BrowserNodeProviderMock();

  constructor() {
    td.when(this.paymentIdUtils.getDomain(commonPaymentId)).thenReturn(
      ok(validDomain),
    );
    td.when(this.paymentIdUtils.getType(commonPaymentId)).thenReturn(
      ok(EPaymentType.Push),
    );
    td.when(this.paymentIdUtils.getUUID(commonPaymentId)).thenReturn(
      ok(UUID(commonPaymentId.substr(34, 32))),
    );
    td.when(
      this.paymentIdUtils.makePaymentId(
        validDomain,
        EPaymentType.Push,
        td.matchers.anything(),
      ),
    ).thenReturn(ok(commonPaymentId));

    td.when(this.timeUtils.getUnixNow()).thenReturn(
      UnixTimestamp(unixNow) as never,
    );
  }

  public factoryProvider(): IPaymentUtils {
    return new PaymentUtils(
      this.configProvider,
      this.logUtils,
      this.paymentIdUtils,
      this.vectorUtils,
      this.browserNodeProvider,
      this.timeUtils,
    );
  }
}

describe("PaymentUtils tests", () => {
  test("isHypernetDomain should return true for vaild inputs", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    // Act
    const result = await utils.isHypernetDomain(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(true);
  });

  test("createPaymentId should create valid paymentId", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    // Act
    const result = await utils.createPaymentId(EPaymentType.Push);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(commonPaymentId);
  });

  test("transfersToPushPayment should return PushPayment for valid transfers", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const offerTransfer: IHypernetOfferDetails = JSON.parse(
      sortedTransfers.offerTransfers[0].transferState.message,
    );

    const result = await utils.transfersToPushPayment(
      commonPaymentId,
      EPaymentState.Proposed,
      sortedTransfers,
    );
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Proposed);
    expect(paymentResult.to).toStrictEqual(offerTransfer.to);
    expect(paymentResult.from).toStrictEqual(offerTransfer.from);
  });

  test("transfersToPullPayment should return PullPayment for valid transfers", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const sortedTransferList = new SortedTransfers(
      [canceledOfferTransfer],
      [activeInsuranceTransfer],
      [activeParameterizedTransfer],
      [],
    );
    const offerTransfer: IHypernetOfferDetails = JSON.parse(
      sortedTransferList.offerTransfers[0].transferState.message,
    );
    offerTransfer.rate = {
      deltaAmount: "0",
      deltaTime: 1,
    };
    sortedTransferList.offerTransfers[0].transferState.message =
      JSON.stringify(offerTransfer);

    const result = await utils.transfersToPullPayment(
      commonPaymentId,
      EPaymentState.Proposed,
      sortedTransferList,
    );
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PullPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Proposed);
    expect(paymentResult.to).toStrictEqual(offerTransfer.to);
    expect(paymentResult.from).toStrictEqual(offerTransfer.from);
  });

  test("transfersToPullPayment should fail if rate is null", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    let paymentResult;
    try {
      await utils.transfersToPullPayment(
        commonPaymentId,
        EPaymentState.Proposed,
        sortedTransfers,
      );
    } catch (err) {
      paymentResult = err;
    }
    console.log("paymentResult: ", paymentResult);

    // Assert
    expect(paymentResult).toBeInstanceOf(LogicalError);
    expect(paymentResult.message).toBe(
      "Pull payment offer does not include rate information",
    );
  });

  test("transfersToPayment should return InvalidFunds Payment from valid transfers and invalid paymentId", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.InvalidFunds);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Borked payment if there is no offerTransfers", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [activeInsuranceTransfer, activeParameterizedTransfer];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Borked);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Borked payment if there is more than one offerTransfer", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [
      activeOfferTransfer,
      activeOfferTransfer,
      activeInsuranceTransfer,
      activeParameterizedTransfer,
    ];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Borked);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if the offerTransfer is canceled", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Borked payment if there is more than one InsuranceTransfer", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [
      activeOfferTransfer,
      activeInsuranceTransfer,
      activeInsuranceTransfer,
      activeParameterizedTransfer,
    ];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Borked);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Borked payment if there is more than one ParameterizedTransfer", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [
      activeOfferTransfer,
      activeInsuranceTransfer,
      activeParameterizedTransfer,
      activeParameterizedTransfer,
    ];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Borked);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Proposed payment if it has an only offer transfer", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [activeOfferTransfer];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Proposed);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if it has Insurance but no parameterized transfer, offerState is Canceled and insuranceState is Resolved", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [activeOfferTransfer, activeInsuranceTransfer];
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Resolved));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Staked payment if it has Insurance but no parameterized transfer, offerState is Active, insuranceState is Active and it has insuranceValid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const transfers = [activeOfferTransfer, activeInsuranceTransfer];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Staked);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return InvalidStake payment if it has Insurance but no parameterized transfer, offerState is Active, insuranceState is Active and it has insurance not Valid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    activeInsuranceTransfer.assetId = erc20AssetAddress;
    const transfers = [activeOfferTransfer, activeInsuranceTransfer];

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.InvalidStake);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if it all three transfer types, offerState is Canceled, insuranceState is Resolved and parameterizedState is Resolved", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Resolved));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer,
      ),
    ).thenReturn(okAsync(ETransferState.Resolved));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if it all three transfer types, offerState is Canceled, insuranceState is Resolved and parameterizedState is Canceled", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Resolved));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer,
      ),
    ).thenReturn(okAsync(ETransferState.Canceled));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if it all three transfer types, offerState is Canceled, insuranceState is Canceled and parameterizedState is Resolved", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer,
      ),
    ).thenReturn(okAsync(ETransferState.Resolved));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Canceled payment if it all three transfer types, offerState is Canceled, insuranceState is Canceled and parameterizedState is Canceled", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeInsuranceTransfer),
    ).thenReturn(okAsync(ETransferState.Canceled));
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(
        activeParameterizedTransfer,
      ),
    ).thenReturn(okAsync(ETransferState.Canceled));

    // Act
    const result = await utils.transfersToPayment(commonPaymentId, transfers);
    const paymentResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentResult).toBeInstanceOf(PushPayment);
    expect(paymentResult.state).toStrictEqual(EPaymentState.Canceled);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });
});
