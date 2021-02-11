import td from "testdouble";

import { BigNumber, PushPayment, Payment, AssetBalance, PullPayment, PublicIdentifier } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import {
  defaultExpirationLength,
  hyperTokenAddress,
  mockUtils,
  publicIdentifier,
  publicIdentifier2,
  unixNow,
} from "@mock/mocks";
import { okAsync, ok, err, errAsync } from "neverthrow";
import {
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  LogicalError,
  OfferMismatchError,
} from "@interfaces/objects/errors";
import { IAccountsRepository, ILinkRepository, IPaymentRepository } from "@interfaces/data";
import { ConfigProviderMock, ContextProviderMock } from "@tests/mock/utils";
import { ILogUtils } from "@interfaces/utilities";
import { IPaymentService } from "@interfaces/business/IPaymentService";
import { PaymentService } from "@implementations/business/PaymentService";

const requiredStake = "42";
const paymentToken = mockUtils.generateRandomPaymentToken();
const disputeMediator = mockUtils.generateRandomEtherAdress();
const amount = "42";
const expirationDate = unixNow + defaultExpirationLength;
const paymentId = "See, this doesn't have to be legit data if it's never checked!";
const nonExistentPaymentId = "This payment is not mocked";

class PaymentServiceMocks {
  public vectorLinkRepository = td.object<ILinkRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public contextProvider = new ContextProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public paymentRepository = td.object<IPaymentRepository>();

  public pushPayment: PushPayment;
  public stakedPushPayment: PushPayment;
  public paidPushPayment: PushPayment;
  public finalizedPushPayment: PushPayment;

  public assetBalance: AssetBalance;

  constructor(hypertokenBalance: string = amount) {
    this.pushPayment = this.factoryPushPayment();
    this.stakedPushPayment = this.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
      requiredStake,
    );
    this.paidPushPayment = this.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Approved,
      requiredStake,
    );
    this.finalizedPushPayment = this.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Finalized,
      requiredStake,
    );

    this.assetBalance = new AssetBalance(
      hyperTokenAddress,
      "PhoebeCoin",
      "BEEP",
      4,
      BigNumber.from(hypertokenBalance),
      BigNumber.from(0),
      BigNumber.from(hypertokenBalance),
    );

    td.when(
      this.paymentRepository.createPushPayment(
        publicIdentifier,
        amount,
        expirationDate,
        requiredStake,
        paymentToken,
        disputeMediator,
      ),
    ).thenReturn(okAsync(this.pushPayment));

    this.setExistingPayments([this.pushPayment]);
    td.when(this.paymentRepository.getPaymentsByIds(td.matchers.contains(nonExistentPaymentId))).thenReturn(
      okAsync(new Map<string, Payment>()),
    );
    td.when(this.accountRepository.getBalanceByAsset(hyperTokenAddress)).thenReturn(okAsync(this.assetBalance));
    td.when(this.paymentRepository.provideStake(paymentId)).thenReturn(okAsync(this.stakedPushPayment));
    td.when(this.paymentRepository.provideAsset(paymentId)).thenReturn(okAsync(this.paidPushPayment));
    td.when(this.paymentRepository.finalizePayment(paymentId, amount)).thenReturn(okAsync(this.finalizedPushPayment));
  }

  public factoryPaymentService(): IPaymentService {
    return new PaymentService(
      this.vectorLinkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
      this.logUtils,
    );
  }

  public setExistingPayments(payments: (PushPayment | PullPayment)[]) {
    const returnedPaymentsMap = new Map<string, Payment>();
    const paymentIds = new Array<string>();

    for (const payment of payments) {
      returnedPaymentsMap.set(payment.id, payment);
      paymentIds.push(payment.id);
    }

    td.when(this.paymentRepository.getPaymentsByIds(td.matchers.contains(paymentIds))).thenReturn(
      okAsync(returnedPaymentsMap),
    );
  }

  public factoryPushPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: string = "0",
  ): PushPayment {
    return new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      BigNumber.from(requiredStake),
      BigNumber.from(amountStaked),
      expirationDate,
      unixNow,
      unixNow,
      BigNumber.from(0),
      disputeMediator,
      BigNumber.from(amount),
      BigNumber.from(0)
    );
  }
}

const assetName = "PhoebeCoin";
const assetSymbol = ":P";

describe("PaymentService tests", () => {
  test("sendFunds returns payment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const response = await paymentService.sendFunds(
      publicIdentifier,
      amount,
      expirationDate,
      requiredStake,
      paymentToken,
      disputeMediator,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(paymentServiceMock.pushPayment);
  });

  test("Should offerReceived works without any errors if payment was found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
  });

  test("Should offerReceived return an error if payment was not found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(LogicalError);
  });

  test("Should acceptOffers return Payment without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const payments = result._unsafeUnwrap();
    expect(payments.length).toBe(1);
    expect(payments[0].isErr()).toBeFalsy();
    expect(payments[0]._unsafeUnwrap()).toBe(paymentServiceMock.stakedPushPayment);
  });

  test("Should acceptOffers return error if payment state is not Proposed", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(publicIdentifier2, publicIdentifier2, EPaymentState.Staked);
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(AcceptPaymentError);
  });

  test("Should acceptOffers return error if freeAmount is less than totalStakeRequired", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks("13");
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InsufficientBalanceError);
  });

  test("Should acceptFunds return error if provideStake fails", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    td.when(paymentServiceMock.paymentRepository.provideStake(paymentId)).thenReturn(errAsync(new Error("test error")));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const paymentResults = result._unsafeUnwrap();
    expect(paymentResults.length).toBe(1);
    expect(paymentResults[0].isErr()).toBeTruthy();
    expect(paymentResults[0]._unsafeUnwrapErr()).toBeInstanceOf(AcceptPaymentError);
  });

  test("Should stakePosted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
      requiredStake,
    );
    paymentServiceMock.setExistingPayments([payment]);

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(1);
  });

  test("Should stakePosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
  });

  test("Should stakePosted return error if requiredStake is  not equal to the amountStaked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
      "13",
    );
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(OfferMismatchError);
  });

  test("Should stakePosted return error if payment state is not Staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Proposed,
      requiredStake,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
  });

  test("Should stakePosted return null if payment from address is different from context publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Staked,
      requiredStake,
    );
    paymentServiceMock.setExistingPayments([payment]);

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(0);
  });

  test("Should paymentPosted run without errors when payment from is equal to publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(publicIdentifier, publicIdentifier2, EPaymentState.Approved);
    paymentServiceMock.setExistingPayments([payment]);

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(1);
    expect(updatedPushPayments[0]).toBe(paymentServiceMock.finalizedPushPayment);
  });

  test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PushPayment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(publicIdentifier2, publicIdentifier, EPaymentState.Approved);
    paymentServiceMock.setExistingPayments([payment]);

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(0);
  });

  // test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PullPayment", async () => {
  //   // Arrange
  //   const paymentServiceMock = new PaymentServiceMocks();
  //   const payment = paymentServiceMock.factoryPullPayment({
  //     state: EPaymentState.Approved,
  //   });
  //   const paymentId = mockUtils.generateRandomPaymentId();
  //   const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

  //   const hypernetContext = paymentServiceMock.getHypernetContextFactory();
  //   hypernetContext.publicIdentifier = mockUtils.generateRandomEtherAdress();
  //   hypernetContext.onPullPaymentApproved = new Subject<PullPayment>();

  //   jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
  //     .calledWith([paymentId])
  //     .mockReturnValue(okAsync(returnedPaymentsMap));
  //   when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

  //   // Assert
  //   expect((await paymentServiceMock.factoryPaymentService().paymentPosted(paymentId))._unsafeUnwrap()).toEqual(undefined);
  // });

  test("Should paymentPosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    expect(updatedPushPayments.length).toBe(0);
  });

  test("Should paymentPosted return error if payment state is not Approved", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(publicIdentifier, publicIdentifier2, EPaymentState.Proposed);
    paymentServiceMock.setExistingPayments([payment]);

    let updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe((val: PushPayment) => {
      updatedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    expect(updatedPushPayments.length).toBe(0);
  });

  test("Should paymentCompleted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    let receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentReceived.subscribe((val: PushPayment) => {
      receivedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(receivedPushPayments.length).toBe(1);
    expect(receivedPushPayments[0]).toBe(paymentServiceMock.pushPayment);
  });

  test("Should paymentCompleted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    let receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentReceived.subscribe((val: PushPayment) => {
      receivedPushPayments.push(val);
    });

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    expect(receivedPushPayments.length).toBe(0);
  });

  // test("Should pullRecorded return error if payment is null", async () => {
  //   // Arrange
  //   const paymentServiceMock = new PaymentServiceMocks();
  //   const payment = null;
  //   const paymentId = mockUtils.generateRandomPaymentId();
  //   const returnedPaymentsMap = new Map<string, Payment | null>([[paymentId, payment]]);
  //   const publicIdentifier = mkPublicIdentifier();
  //   const hypernetContext = paymentServiceMock.getHypernetContextFactory();
  //   hypernetContext.publicIdentifier = publicIdentifier;

  //   const throwenError = new InvalidParametersError(`Invalid payment ID!`);

  //   jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
  //     .calledWith([paymentId])
  //     .mockReturnValue(okAsync(returnedPaymentsMap));
  //   when(paymentServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

  //   // Assert
  //   expect((await paymentServiceMock.factoryPaymentService().pullRecorded(paymentId))._unsafeUnwrapErr()).toEqual(
  //     throwenError,
  //   );
  // });
});
