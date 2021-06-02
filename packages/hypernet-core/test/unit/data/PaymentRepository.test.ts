import {
  PaymentInternalDetails,
  PushPayment,
  EPaymentState,
  EPaymentType,
  IBasicTransferResponse,
  VectorError,
  PaymentCreationError,
  TransferResolutionError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { PaymentRepository } from "@implementations/data/PaymentRepository";
import { IPaymentRepository } from "@interfaces/data";
import {
  IVectorUtils,
  IBrowserNodeProvider,
  IPaymentUtils,
  ITimeUtils,
} from "@interfaces/utilities";
import {
  commonAmount,
  routerChannelAddress,
  publicIdentifier,
  commonPaymentId,
  publicIdentifier2,
  unixNow,
  defaultExpirationLength,
  parameterizedTransferId,
  offerTransferId,
  insuranceTransferId,
  merchantUrl,
  erc20AssetAddress,
  merchantAddress,
} from "@mock/mocks";
import {
  BlockchainProviderMock,
  BrowserNodeProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  PaymentUtilsMockFactory,
} from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

const expirationDate = unixNow + defaultExpirationLength;
const counterPartyAccount = publicIdentifier2;
const fromAccount = publicIdentifier;
const paymentDetails = new PaymentInternalDetails(
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
  [],
);

class PaymentRepositoryMocks {
  public timeUtils = td.object<ITimeUtils>();
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
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
    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow);
    td.when(this.timeUtils.getBlockchainTimestamp()).thenReturn(
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

    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(
      okAsync(routerChannelAddress),
    );

    td.when(
      this.vectorUtils.createOfferTransfer(
        counterPartyAccount,
        td.matchers.contains({
          paymentId: commonPaymentId,
          creationDate: unixNow,
          to: publicIdentifier2,
          from: publicIdentifier,
          requiredStake: commonAmount.toString(),
          paymentAmount: commonAmount.toString(),
          expirationDate,
          paymentToken: erc20AssetAddress,
          merchantUrl: merchantUrl,
        }),
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: offerTransferId,
      }),
    );

    td.when(
      this.vectorUtils.resolvePaymentTransfer(
        parameterizedTransferId,
        commonPaymentId,
        commonAmount.toString(),
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId,
      }),
    );

    td.when(
      this.vectorUtils.createInsuranceTransfer(
        publicIdentifier,
        merchantAddress,
        td.matchers.argThat((val: BigNumber) => {
          return val.eq(commonAmount);
        }),
        expirationDate,
        commonPaymentId,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: insuranceTransferId,
      }),
    );

    td.when(
      this.vectorUtils.createPaymentTransfer(
        EPaymentType.Push,
        publicIdentifier2,
        td.matchers.argThat((val: BigNumber) => {
          return val.eq(commonAmount);
        }),
        erc20AssetAddress,
        commonPaymentId,
        unixNow - 1,
        expirationDate,
        undefined,
        undefined,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: parameterizedTransferId,
      }),
    );

    td.when(
      this.vectorUtils.resolveInsuranceTransfer(
        insuranceTransferId,
        commonPaymentId,
        undefined,
        BigNumber.from("0"),
      ),
    ).thenReturn(okAsync({} as IBasicTransferResponse));
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
    );
  }

  public factoryPushPayment(
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: string = commonAmount.toString(),
  ): PushPayment {
    return new PushPayment(
      commonPaymentId,
      counterPartyAccount,
      fromAccount,
      state,
      erc20AssetAddress,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(amountStaked),
      expirationDate,
      unixNow,
      unixNow,
      BigNumber.from(0),
      merchantUrl,
      paymentDetails,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(0),
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
      counterPartyAccount,
      commonAmount.toString(),
      expirationDate,
      commonAmount.toString(),
      erc20AssetAddress,
      merchantUrl,
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
      counterPartyAccount,
      commonAmount.toString(),
      expirationDate,
      commonAmount.toString(),
      erc20AssetAddress,
      merchantUrl,
    );
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(PaymentCreationError);
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

  test("Should finalizePayment work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.finalizePayment(
      commonPaymentId,
      commonAmount.toString(),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(paymentRepositoryMocks.approvedPayment);
  });

  test("Should finalizePayment return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.finalizePayment(
      commonPaymentId,
      commonAmount.toString(),
    );
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
    const result = await repo.provideStake(commonPaymentId, merchantAddress);

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
    const result = await repo.provideStake(commonPaymentId, merchantAddress);
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
        undefined,
        BigNumber.from("0"),
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
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(TransferResolutionError);
  });
});
