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
  EthereumAddress,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ILogUtils, ITimeUtils } from "@hypernetlabs/utils";
import { PaymentUtils } from "@implementations/utilities";
import { IPaymentIdUtils, IPaymentUtils } from "@interfaces/utilities";
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
  offerDetails,
  offerTransferId,
} from "@mock/mocks";
import { ok, okAsync } from "neverthrow";
import td from "testdouble";

import {
  BlockchainProviderMock,
  ConfigProviderMock,
  VectorUtilsMockFactory,
  BrowserNodeProviderMock,
} from "@mock/utils";

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

    // Assert
    expect(paymentResult).toBeInstanceOf(LogicalError);
    expect(paymentResult.message).toBe(
      "Pull payment offer does not include rate information",
    );
  });

  // TODO: transfersToPayment is returning approved payment instead, check if this is correct
  /* test("transfersToPayment should return InvalidFunds Payment from valid transfers and invalid paymentId", async () => {
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
  }); */

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
    const insuranceTransfer = { ...activeInsuranceTransfer };
    insuranceTransfer.assetId = erc20AssetAddress;
    const transferList = [activeOfferTransfer, insuranceTransfer];

    // Act
    const result = await utils.transfersToPayment(
      commonPaymentId,
      transferList,
    );
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

  test("transfersToPayment should return Approved payment if it all three transfer types, offerState is Active, insuranceState is Active, parameterizedState is Active and payment is vaild", async () => {
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
    expect(paymentResult.state).toStrictEqual(EPaymentState.Approved);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Accepted payment if it all three transfer types, offerState is Active, insuranceState is Active, parameterizedState is Resolved and payment is vaild", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
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
    expect(paymentResult.state).toStrictEqual(EPaymentState.Accepted);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return InsuranceReleased payment if it all three transfer types, offerState is Active, insuranceState is Resolved, parameterizedState is Resolved and payment is vaild", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
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
    expect(paymentResult.state).toStrictEqual(EPaymentState.InsuranceReleased);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return Finalized payment if it all three transfer types, offerState is Resolved, insuranceState is Resolved, parameterizedState is Resolved and payment is vaild", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    td.when(
      mocks.vectorUtils.getTransferStateFromTransfer(activeOfferTransfer),
    ).thenReturn(okAsync(ETransferState.Resolved));
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
    expect(paymentResult.state).toStrictEqual(EPaymentState.Finalized);
    expect(paymentResult.id).toStrictEqual(commonPaymentId);
  });

  test("transfersToPayment should return InvalidFunds payment if it all three transfer types, offerState is Active, insuranceState is Active, parameterizedState is Active and payment is not vaild", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    // Invalid the payment
    transfers[2].assetId = EthereumAddress("invalid address");

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

  test("validateInsuranceTransfer should return true if transfer is valid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const offerDetailsTmp = { ...offerDetails };

    // Act
    const result = utils.validateInsuranceTransfer(
      activeInsuranceTransfer,
      offerDetailsTmp,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  test("validateInsuranceTransfer should return false if transfer is invalid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const offerDetailsTmp = { ...offerDetails };
    offerDetailsTmp.requiredStake = BigNumberString("5");

    // Act
    const result = utils.validateInsuranceTransfer(
      activeInsuranceTransfer,
      offerDetailsTmp,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  test("validatePaymentTransfer should return true if transfer is valid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const offerDetailsTmp = { ...offerDetails };
    offerDetailsTmp.paymentToken = erc20AssetAddress;
    offerDetailsTmp.paymentAmount = BigNumberString("3");
    const activeParameterizedTransferTmp = { ...activeParameterizedTransfer };
    activeParameterizedTransferTmp.balance.amount = [BigNumberString("3")];
    activeParameterizedTransferTmp.assetId = erc20AssetAddress;

    // Act
    const result = utils.validatePaymentTransfer(
      activeParameterizedTransferTmp,
      offerDetailsTmp,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(true);
  });

  test("validatePaymentTransfer should return false if transfer is invalid", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();
    const offerDetailsTmp = { ...offerDetails };
    offerDetailsTmp.paymentAmount = BigNumberString("3");
    const activeParameterizedTransferTmp = { ...activeParameterizedTransfer };
    activeParameterizedTransferTmp.balance.amount = [BigNumberString("6")];

    // Act
    const result = utils.validatePaymentTransfer(
      activeParameterizedTransferTmp,
      offerDetailsTmp,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  test("transfersToPayments should return list of payments", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const result = await utils.transfersToPayments(transfers);
    const paymentsResult = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(paymentsResult[0]).toBeInstanceOf(PushPayment);
  });

  test("sortTransfers should return list sortTransfers list", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const result = await utils.sortTransfers(commonPaymentId, transfers);
    const res = result._unsafeUnwrap();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(res).toBeInstanceOf(SortedTransfers);
  });

  test("getEarliestDateFromTransfers should return UnixTimestamp", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const result = await utils.getEarliestDateFromTransfers(transfers);

    // Assert
    expect(result).toBeDefined();
  });

  test("getFirstTransfer should return first transfer", async () => {
    // Arrange
    const mocks = new PaymentUtilsMocks();
    const utils = mocks.factoryProvider();

    // Act
    const result = await utils.getFirstTransfer(transfers);

    // Assert
    expect(result).toBeDefined();
    expect(result.transferId).toBe(offerTransferId);
  });
});
