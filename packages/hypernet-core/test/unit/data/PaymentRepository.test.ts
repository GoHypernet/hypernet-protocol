import td from "testdouble";
require("testdouble-jest")(td, jest);
import {
  commonAmount,
  routerChannelAddress,
  publicIdentifier,
  commonPaymentId,
  mockUtils,
  publicIdentifier2,
} from "@mock/mocks";
import { BlockchainProviderMock, BrowserNodeProviderMock, ConfigProviderMock, ContextProviderMock } from "@mock/utils";
import {
  BigNumber,
  IHypernetOfferDetails,
  PushPayment,
  Payment,
  SortedTransfers,
  PublicIdentifier,
} from "@interfaces/objects";
import { ILogUtils, IVectorUtils, IBrowserNodeProvider, IPaymentUtils } from "@interfaces/utilities";
import { VectorError } from "@interfaces/objects/errors";
import { IPaymentRepository } from "@interfaces/data";
import { okAsync, errAsync } from "neverthrow";

const moment = td.replace("moment", () => {
  return {
    format: () => {
      return "2021-02-03T04:28:09+03:00";
    },
    unix: () => {
      return 1318874398;
    },
  };
});
import { PaymentRepository } from "@implementations/data/PaymentRepository";
import { EPaymentState, EPaymentType, ETransferType } from "@interfaces/types";

const paymentToken = mockUtils.generateRandomPaymentToken();
const disputeMediator = mockUtils.generateRandomEtherAdress();
const now = moment();
const expirationDate = moment(now.format());
const paymentId = commonPaymentId;
const counterPartyAccount = publicIdentifier2;
const fromAccount = publicIdentifier;
const transferMetadata: IHypernetOfferDetails = {
  paymentId,
  creationDate: now.unix(),
  to: counterPartyAccount,
  from: fromAccount,
  requiredStake: commonAmount.toString(),
  paymentAmount: commonAmount.toString(),
  expirationDate: expirationDate.unix(),
  paymentToken,
  disputeMediator,
};

class PaymentRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public paymentUtils = td.object<IPaymentUtils>();
  public logUtils = td.object<ILogUtils>();
  public createdPushPayment: PushPayment;

  constructor() {
    this.createdPushPayment = this.factoryPushPayment();

    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    td.when(this.vectorUtils.createMessageTransfer(counterPartyAccount, transferMetadata)).thenReturn(
      okAsync({ channelAddress: routerChannelAddress, transferId: paymentId }),
    );
    td.when(
      this.vectorUtils.resolvePaymentTransfer(
        this.browserNodeProvider.fullTransferState.transferId,
        commonPaymentId,
        commonAmount.toString(),
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: commonPaymentId,
      }),
    );
    td.when(
      this.vectorUtils.createInsuranceTransfer(
        this.createdPushPayment.from,
        this.createdPushPayment.disputeMediator,
        this.createdPushPayment.requiredStake,
        `${`${moment().unix()}` + this.configProvider.config.defaultPaymentExpiryLength}`,
        this.createdPushPayment.id,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: commonPaymentId,
      }),
    );
    td.when(
      this.vectorUtils.createPaymentTransfer(
        EPaymentType.Push,
        this.createdPushPayment.to,
        this.createdPushPayment.paymentAmount,
        this.createdPushPayment.paymentToken,
        this.createdPushPayment.id,
        `${moment().unix()}`,
        `${`${moment().unix()}` + this.configProvider.config.defaultPaymentExpiryLength}`,
      ),
    ).thenReturn(
      okAsync({
        channelAddress: routerChannelAddress,
        transferId: commonPaymentId,
      }),
    );

    td.when(this.paymentUtils.createPaymentId(EPaymentType.Push)).thenReturn(okAsync(paymentId));
    td.when(
      this.paymentUtils.transfersToPayment(
        paymentId,
        [this.browserNodeProvider.fullTransferState]
      ),
    ).thenReturn(okAsync(this.createdPushPayment));
    td.when(
      this.paymentUtils.transfersToPayment(
        paymentId,
        [this.browserNodeProvider.fullTransferState, this.browserNodeProvider.fullTransferState],
      ),
    ).thenReturn(okAsync({ ...this.createdPushPayment, state: EPaymentState.Approved }));
    td.when(
      this.paymentUtils.getTransferTypeWithTransfer(
        this.browserNodeProvider.fullTransferState
      ),
    ).thenReturn(
      okAsync({ transferType: ETransferType.Insurance, transfer: this.browserNodeProvider.fullTransferState }),
    );
    td.when(
      this.paymentUtils.transfersToPayments(
        [this.browserNodeProvider.fullTransferState]
      ),
    ).thenReturn(okAsync([this.createdPushPayment]));
    td.when(
      this.paymentUtils.sortTransfers(
        commonPaymentId,
        [this.browserNodeProvider.fullTransferState],
      ),
    ).thenReturn(
      okAsync(
        new SortedTransfers(
          this.browserNodeProvider.fullTransferState,
          this.browserNodeProvider.fullTransferState,
          this.browserNodeProvider.fullTransferState,
          [this.browserNodeProvider.fullTransferState],
          transferMetadata,
        ),
      ),
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
    );
  }

  public factoryPushPayment(
    to: PublicIdentifier = counterPartyAccount,
    from: PublicIdentifier = fromAccount,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: string = commonAmount.toString(),
  ): PushPayment {
    return new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(amountStaked),
      expirationDate.unix(),
      false,
      now.unix(),
      now.unix(),
      BigNumber.from(0),
      disputeMediator,
      BigNumber.from(commonAmount.toString()),
    );
  }
}

class PaymentRepositoryErrorMocks {
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  private paymentRepositoryMocks = new PaymentRepositoryMocks();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(errAsync(new VectorError()));
  }

  public factoryPaymentRepository(): IPaymentRepository {
    return new PaymentRepository(
      this.browserNodeProvider,
      this.paymentRepositoryMocks.vectorUtils,
      this.paymentRepositoryMocks.configProvider,
      this.paymentRepositoryMocks.contextProvider,
      this.paymentRepositoryMocks.paymentUtils,
      this.paymentRepositoryMocks.logUtils,
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
      paymentToken,
      disputeMediator,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(paymentRepositoryMocks.createdPushPayment);
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
      paymentToken,
      disputeMediator,
    );
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should getPaymentsByIds return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, paymentRepositoryMocks.createdPushPayment]]);

    // get payments of created push payment id
    const result = await repo.getPaymentsByIds([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(returnedPaymentsMap);
  });

  test("Should getPaymentsByIds return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.getPaymentsByIds([paymentId]);
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
    const result = await repo.finalizePayment(commonPaymentId, commonAmount.toString());

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(paymentRepositoryMocks.createdPushPayment);
  });

  test("Should finalizePayment return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.finalizePayment(commonPaymentId, commonAmount.toString());
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should provideStake work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideStake(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual({
      ...paymentRepositoryMocks.createdPushPayment,
      state: EPaymentState.Approved,
    });
  });

  test("Should provideStake return error if getBrowserNode failed", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryErrorMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideStake(commonPaymentId);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should provideAsset work and return Payment without any errors", async () => {
    // Arrange
    const paymentRepositoryMocks = new PaymentRepositoryMocks();
    const repo = paymentRepositoryMocks.factoryPaymentRepository();

    // Act
    const result = await repo.provideAsset(commonPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual({
      ...paymentRepositoryMocks.createdPushPayment,
      state: EPaymentState.Approved,
    });
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
});
