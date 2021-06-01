import {
  PushPayment,
  Payment,
  AssetBalance,
  PullPayment,
  PublicIdentifier,
  PaymentInternalDetails,
  PaymentId,
  EthereumAddress,
  MerchantUrl,
  Signature,
  Balances,
  EPaymentState,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  LogicalError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { PaymentService } from "@implementations/business/PaymentService";
import { IPaymentService } from "@interfaces/business/IPaymentService";
import {
  IAccountsRepository,
  ILinkRepository,
  IMerchantConnectorRepository,
  IPaymentRepository,
} from "@interfaces/data";
import {
  defaultExpirationLength,
  merchantUrl,
  hyperTokenAddress,
  insuranceTransferId,
  mockUtils,
  offerTransferId,
  parameterizedTransferId,
  publicIdentifier,
  publicIdentifier2,
  unixNow,
  account,
} from "@mock/mocks";
import { ConfigProviderMock, ContextProviderMock } from "@tests/mock/utils";

const requiredStake = BigNumber.from("42");
const paymentToken = mockUtils.generateRandomPaymentToken();
const amount = BigNumber.from("42");
const expirationDate = unixNow + defaultExpirationLength;
const paymentId = PaymentId(
  "See, this doesn't have to be legit data if it's never checked!",
);
const nonExistentPaymentId = PaymentId("This payment is not mocked");
const validatedSignature = Signature("0xValidatedSignature");
const paymentDetails = new PaymentInternalDetails(
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
  [],
);

class PaymentServiceMocks {
  public vectorLinkRepository = td.object<ILinkRepository>();
  public accountRepository = td.object<IAccountsRepository>();
  public contextProvider = new ContextProviderMock();
  public configProvider = new ConfigProviderMock();
  public logUtils = td.object<ILogUtils>();
  public paymentRepository = td.object<IPaymentRepository>();
  public merchantConnectorRepository = td.object<IMerchantConnectorRepository>();

  public pushPayment: PushPayment;
  public stakedPushPayment: PushPayment;
  public paidPushPayment: PushPayment;
  public finalizedPushPayment: PushPayment;

  public assetBalance: AssetBalance;
  public merchantAddresses: Map<MerchantUrl, EthereumAddress>;

  constructor(hypertokenBalance: BigNumber = amount) {
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
      hypertokenBalance,
      BigNumber.from(0),
      hypertokenBalance,
    );

    td.when(
      this.paymentRepository.createPushPayment(
        publicIdentifier,
        amount.toString(),
        expirationDate,
        requiredStake.toString(),
        paymentToken,
        merchantUrl,
      ),
    ).thenReturn(okAsync(this.pushPayment));

    this.setExistingPayments([this.pushPayment]);
    td.when(
      this.paymentRepository.getPaymentsByIds(
        td.matchers.contains(nonExistentPaymentId),
      ),
    ).thenReturn(okAsync(new Map<PaymentId, Payment>()));
    td.when(
      this.accountRepository.getBalanceByAsset(hyperTokenAddress),
    ).thenReturn(okAsync(this.assetBalance));
    td.when(this.paymentRepository.provideStake(paymentId, account)).thenReturn(
      okAsync(this.stakedPushPayment),
    );
    td.when(
      this.accountRepository.getBalanceByAsset(hyperTokenAddress),
    ).thenReturn(okAsync(this.assetBalance));
    td.when(this.accountRepository.getBalances()).thenReturn(
      okAsync(new Balances([this.assetBalance])),
    );
    td.when(this.paymentRepository.provideStake(paymentId, account)).thenReturn(
      okAsync(this.stakedPushPayment),
    );
    td.when(this.paymentRepository.provideAsset(paymentId)).thenReturn(
      okAsync(this.paidPushPayment),
    );
    td.when(
      this.paymentRepository.finalizePayment(paymentId, amount.toString()),
    ).thenReturn(okAsync(this.finalizedPushPayment));

    this.merchantAddresses = new Map();
    this.merchantAddresses.set(merchantUrl, account);
    td.when(
      this.merchantConnectorRepository.getMerchantAddresses(
        td.matchers.contains(merchantUrl),
      ),
    ).thenReturn(okAsync(this.merchantAddresses));
    td.when(
      this.merchantConnectorRepository.getAuthorizedMerchants(),
    ).thenReturn(
      okAsync(
        new Map([
          [this.pushPayment.merchantUrl, Signature(validatedSignature)],
        ]),
      ),
    );
    td.when(
      this.merchantConnectorRepository.addAuthorizedMerchant(
        merchantUrl,
        new Balances([this.assetBalance]),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.merchantConnectorRepository.getAuthorizedMerchantConnectorStatus(),
    ).thenReturn(okAsync(new Map([[merchantUrl, true]])));

    td.when(
      this.paymentRepository.resolveInsurance(paymentId, insuranceTransferId),
    ).thenReturn(okAsync(undefined));
  }

  public factoryPaymentService(): IPaymentService {
    return new PaymentService(
      this.vectorLinkRepository,
      this.accountRepository,
      this.contextProvider,
      this.configProvider,
      this.paymentRepository,
      this.merchantConnectorRepository,
      this.logUtils,
    );
  }

  public setExistingPayments(payments: (PushPayment | PullPayment)[]) {
    const returnedPaymentsMap = new Map<PaymentId, Payment>();
    const paymentIds = new Array<string>();

    for (const payment of payments) {
      returnedPaymentsMap.set(payment.id, payment);
      paymentIds.push(payment.id);
    }

    td.when(
      this.paymentRepository.getPaymentsByIds(td.matchers.contains(paymentIds)),
    ).thenReturn(okAsync(returnedPaymentsMap));
  }

  public setMerchantStatus(merchantUrl: MerchantUrl, status: boolean) {
    td.when(
      this.merchantConnectorRepository.getAuthorizedMerchantConnectorStatus(),
    ).thenReturn(okAsync(new Map([[merchantUrl, false]])));
  }

  public factoryPushPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumber = BigNumber.from("0"),
  ): PushPayment {
    return new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      requiredStake,
      amountStaked,
      expirationDate,
      unixNow,
      unixNow,
      BigNumber.from(0),
      merchantUrl,
      paymentDetails,
      amount,
      BigNumber.from(0),
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
      merchantUrl,
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
    expect(payments[0]._unsafeUnwrap()).toBe(
      paymentServiceMock.stakedPushPayment,
    );
  });

  test("Should acceptOffers return error if payment state is not Proposed", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier2,
      EPaymentState.Staked,
    );
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
    const paymentServiceMock = new PaymentServiceMocks(BigNumber.from("13"));
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

    td.when(
      paymentServiceMock.paymentRepository.provideStake(paymentId, account),
    ).thenReturn(errAsync(new Error("test error")));

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const paymentResults = result._unsafeUnwrap();
    expect(paymentResults.length).toBe(1);
    expect(paymentResults[0].isErr()).toBeTruthy();
    expect(paymentResults[0]._unsafeUnwrapErr()).toBeInstanceOf(
      AcceptPaymentError,
    );
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

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(2);
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

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(1);
  });

  test("Should paymentPosted run without errors when payment from is equal to publicIdentifier", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(2);
    expect(updatedPushPayments[1]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
  });

  test("Should paymentPosted run without errors when payment from is not equal to publicIdentifier and payment is PushPayment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(updatedPushPayments.length).toBe(1);
  });

  test("Should paymentPosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const updatedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        updatedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    expect(updatedPushPayments.length).toBe(0);
  });

  test("Should paymentCompleted run without errors", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

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

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentReceived.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    expect(receivedPushPayments.length).toBe(0);
  });

  test("Should advancePayments provide asset if payment is staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Staked,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.contextProvider.context.publicIdentifier = publicIdentifier;

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([paymentId]);
    const provideAssetCallingcount = td.explain(
      paymentServiceMock.paymentRepository.provideAsset,
    ).callCount;

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(receivedPushPayments.length).toBe(1);
    expect(provideAssetCallingcount).toBe(1);
    expect(receivedPushPayments[0]).toBe(paymentServiceMock.paidPushPayment);
  });

  test("Should advancePayments finalize payments if payment is approved", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
      EPaymentState.Approved,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.contextProvider.context.publicIdentifier = publicIdentifier;

    const receivedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentUpdated.subscribe(
      (val: PushPayment) => {
        receivedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(receivedPushPayments.length).toBe(1);
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
  });

  test("Should advancePayments pass and trigger onPushPaymentDelayed if payment merchant is inactive", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.setMerchantStatus(merchantUrl, false);
    paymentServiceMock.contextProvider.context.publicIdentifier = publicIdentifier;

    const delayedPushPayments = new Array<PushPayment>();
    paymentServiceMock.contextProvider.onPushPaymentDelayed.subscribe(
      (val: PushPayment) => {
        delayedPushPayments.push(val);
      },
    );

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.advancePayments([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    expect(delayedPushPayments.length).toBe(1);
    expect(delayedPushPayments[0]).toStrictEqual(
      paymentServiceMock.pushPayment,
    );
  });

  test("Should resolveInsurance works without any errors if payment is accepted and has amount staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();
    const acceptedPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Accepted,
      requiredStake,
    );
    paymentServiceMock.setExistingPayments([acceptedPayment]);

    // Act
    const result = await paymentService.resolveInsurance(acceptedPayment.id);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(acceptedPayment);
  });

  test("Should resolveInsurance fails if payment is not accepted", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.resolveInsurance(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
  });

  test("Should resolveInsurance fails if payment requiered stake is not equal to amount staked", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();
    const acceptedPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
      EPaymentState.Accepted,
      requiredStake,
    );
    acceptedPayment.amountStaked = BigNumber.from("10");
    paymentServiceMock.setExistingPayments([acceptedPayment]);

    // Act
    const result = await paymentService.resolveInsurance(acceptedPayment.id);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
  });
});
