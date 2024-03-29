import {
  PushPayment,
  EPaymentState,
  VectorError,
  TransferResolutionError,
  BigNumberString,
  SortedTransfers,
} from "@hypernetlabs/objects";
import { ILogUtils, ITimeUtils } from "@hypernetlabs/utils";
import { IPaymentRepository } from "@interfaces/data";
import {
  commonAmount,
  publicIdentifier,
  commonPaymentId,
  publicIdentifier2,
  unixNow,
  insuranceTransferId,
  gatewayUrl,
  erc20AssetAddress,
  gatewayAddress,
  expirationDate,
  routerPublicIdentifier,
  chainId,
  routerChannelAddress,
} from "@mock/mocks";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { PaymentRepository } from "@implementations/data/PaymentRepository";
import {
  IBrowserNodeProvider,
  IPaymentUtils,
  IBlockchainTimeUtils,
} from "@interfaces/utilities";
import {
  BlockchainProviderMock,
  BrowserNodeProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  PaymentUtilsMockFactory,
  VectorUtilsMockFactory,
} from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

const paymentDetails = new SortedTransfers([], [], [], []);

class PaymentRepositoryMocks {
  public timeUtils = td.object<ITimeUtils>();
  public blockchainTimeUtils = td.object<IBlockchainTimeUtils>();
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = VectorUtilsMockFactory.factoryVectorUtils();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider: BrowserNodeProviderMock;
  public paymentUtils: IPaymentUtils;
  public logUtils = td.object<ILogUtils>();
  public proposedPayment: PushPayment;
  public stakedPayment: PushPayment;
  public approvedPayment: PushPayment;

  constructor(
    includeOfferTransfer = true,
    includeInsuranceTransfer = true,
    includeParameterizedTransfer = true,
  ) {
    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow as never);
    td.when(this.blockchainTimeUtils.getBlockchainTimestamp()).thenReturn(
      okAsync(unixNow),
    );

    this.browserNodeProvider = new BrowserNodeProviderMock(
      includeOfferTransfer,
      includeInsuranceTransfer,
      includeParameterizedTransfer,
    );

    this.proposedPayment = this.factoryPushPayment(EPaymentState.Proposed);
    this.stakedPayment = this.factoryPushPayment(EPaymentState.Staked);
    this.approvedPayment = this.factoryPushPayment(EPaymentState.Approved);

    this.paymentUtils = PaymentUtilsMockFactory.factoryPaymentUtils(
      this.browserNodeProvider,
      this.proposedPayment,
      this.stakedPayment,
      this.approvedPayment,
    );
  }

  public factoryPaymentRepository(): IPaymentRepository {
    return new PaymentRepository(
      this.browserNodeProvider,
      this.vectorUtils,
      this.configProvider,
      this.contextProvider,
      this.paymentUtils,
      this.logUtils,
      this.timeUtils,
      this.blockchainTimeUtils,
    );
  }

  public factoryPushPayment(
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumberString = commonAmount,
  ): PushPayment {
    return new PushPayment(
      commonPaymentId, // id
      routerPublicIdentifier, // routerPublicIdentifier
      chainId, // chainId
      publicIdentifier2, // to
      publicIdentifier, // from
      state, // state
      erc20AssetAddress, // paymentToken
      commonAmount, // requiredStake
      amountStaked, // amountStaked
      expirationDate, // expirationDate
      unixNow, // createdTimestamp
      unixNow, // updatedTimestamp
      BigNumberString("0"), // collateralRecovered
      gatewayUrl, // gatewayUrl
      paymentDetails, // details
      null, // metadata
      commonAmount, // paymentAmount
      BigNumberString("0"), // amountTransferred
    );
  }
}

class PaymentRepositoryErrorMocks {
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  private paymentRepositoryMocks = new PaymentRepositoryMocks();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(
      errAsync(new VectorError()),
    );
  }

  public factoryPaymentRepository(): IPaymentRepository {
    return new PaymentRepository(
      this.browserNodeProvider,
      this.paymentRepositoryMocks.vectorUtils,
      this.paymentRepositoryMocks.configProvider,
      this.paymentRepositoryMocks.contextProvider,
      this.paymentRepositoryMocks.paymentUtils,
      this.paymentRepositoryMocks.logUtils,
      this.paymentRepositoryMocks.timeUtils,
      this.paymentRepositoryMocks.blockchainTimeUtils,
    );
  }
}

describe("PaymentRepository tests", () => {
  test("Should createPushPayment and return payment without errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.createPushPayment(
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier2,
      commonAmount,
      expirationDate,
      commonAmount,
      erc20AssetAddress,
      gatewayUrl,
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const payment = result._unsafeUnwrap();
    expect(payment).toBe(paymentRepositoryMocks.proposedPayment);
  });

  test("Should createPushPayment return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.createPushPayment(
      commonPaymentId,
      routerChannelAddress,
      publicIdentifier2,
      commonAmount,
      expirationDate,
      commonAmount,
      erc20AssetAddress,
      gatewayUrl,
      null,
    );
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should getPaymentsByIds return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.getPaymentsByIds([commonPaymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const resultMap = result._unsafeUnwrap();
    expect(resultMap).toBeInstanceOf(Map);
    expect(resultMap.get(commonPaymentId)).toBe(
      paymentRepositoryMocks.approvedPayment,
    );
  });

  test("Should getPaymentsByIds return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.getPaymentsByIds([commonPaymentId]);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should acceptPayment work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.acceptPayment(commonPaymentId, commonAmount);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(paymentRepositoryMocks.approvedPayment);
  });

  test("Should acceptPayment return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.acceptPayment(commonPaymentId, commonAmount);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should provideStake work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks(
      true,
      false,
      false,
    );
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideStake(commonPaymentId, gatewayAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const payment = result._unsafeUnwrap();
    expect(payment).toBe(paymentRepositoryMocks.stakedPayment);
  });

  test("Should provideStake return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideStake(commonPaymentId, gatewayAddress);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should provideAsset work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks(
      true,
      true,
      false,
    );
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideAsset(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const payment = result._unsafeUnwrap();
    expect(payment).toBe(paymentRepositoryMocks.approvedPayment);
  });

  test("Should provideStake return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideAsset(commonPaymentId);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("resolveInsurance runs without errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.resolveInsurance(
      commonPaymentId,
      insuranceTransferId,
      BigNumberString("0"),
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
  });

  test("resolveInsurance fails if resolveInsuranceTransfer failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();
    td.when(
      paymentRepositoryMocks.vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        null,
        BigNumberString("0"),
      ),
    ).thenReturn(
      errAsync(
        new TransferResolutionError(
          new Error("resolveInsuranceTransfer failed"),
        ),
      ),
    );

    // Act
    const result = await repo.resolveInsurance(
      commonPaymentId,
      insuranceTransferId,
      BigNumberString("0"),
      null,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TransferResolutionError);
  });
});
