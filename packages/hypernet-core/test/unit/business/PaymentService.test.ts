import {
  PushPayment,
  Payment,
  AssetBalance,
  PullPayment,
  PublicIdentifier,
  PaymentInternalDetails,
  PaymentId,
  EthereumAddress,
  GatewayUrl,
  Signature,
  Balances,
  EPaymentState,
  AcceptPaymentError,
  InsufficientBalanceError,
  InvalidParametersError,
  BigNumberString,
  UnixTimestamp,
  InvalidPaymentError,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { PaymentService } from "@implementations/business/PaymentService";
import { IPaymentService } from "@interfaces/business/IPaymentService";
import {
  IAccountsRepository,
  ILinkRepository,
  IGatewayConnectorRepository,
  IPaymentRepository,
} from "@interfaces/data";
import {
  defaultExpirationLength,
  gatewayUrl,
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

const requiredStake = BigNumberString("42");
const paymentToken = mockUtils.generateRandomPaymentToken();
const amount = BigNumberString("42");
const expirationDate = UnixTimestamp(unixNow + defaultExpirationLength);
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
  public merchantConnectorRepository = td.object<IGatewayConnectorRepository>();

  public proposedPushPayment: PushPayment;
  public stakedPushPayment: PushPayment;
  public paidPushPayment: PushPayment;
  public finalizedPushPayment: PushPayment;

  public assetBalance: AssetBalance;
  public merchantAddresses: Map<GatewayUrl, EthereumAddress>;

  constructor(hypertokenBalance: BigNumberString = amount) {
    this.proposedPushPayment = this.factoryPushPayment();
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
      BigNumberString("0"),
      hypertokenBalance,
    );

    td.when(
      this.paymentRepository.createPushPayment(
        publicIdentifier,
        amount,
        expirationDate,
        requiredStake,
        paymentToken,
        gatewayUrl,
        null,
      ),
    ).thenReturn(okAsync(this.proposedPushPayment));

    // By default, there is a proposed push payment existing
    this.setExistingPayments([this.proposedPushPayment]);
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

    td.when(this.paymentRepository.acceptPayment(paymentId, amount)).thenReturn(
      okAsync(this.finalizedPushPayment),
    );

    this.merchantAddresses = new Map();
    this.merchantAddresses.set(gatewayUrl, account);
    td.when(
      this.merchantConnectorRepository.getGatewayAddresses(
        td.matchers.contains(gatewayUrl),
      ),
    ).thenReturn(okAsync(this.merchantAddresses));

    td.when(
      this.merchantConnectorRepository.getAuthorizedGateways(),
    ).thenReturn(okAsync(new Map([[gatewayUrl, validatedSignature]])));

    td.when(
      this.merchantConnectorRepository.addAuthorizedGateway(
        gatewayUrl,
        new Balances([this.assetBalance]),
      ),
    ).thenReturn(okAsync(undefined));

    td.when(
      this.merchantConnectorRepository.getAuthorizedGatewaysConnectorsStatus(),
    ).thenReturn(okAsync(new Map([[gatewayUrl, true]])));

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

  public setGatewayStatus(gatewayUrl: GatewayUrl, status: boolean) {
    td.when(
      this.merchantConnectorRepository.getAuthorizedGatewaysConnectorsStatus(),
    ).thenReturn(okAsync(new Map([[gatewayUrl, false]])));
  }

  public factoryPushPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumberString = BigNumberString("0"),
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
      BigNumberString("0"),
      gatewayUrl,
      paymentDetails,
      null,
      amount,
      BigNumberString("0"),
    );
  }

  public factoryPullPayment(
    to: PublicIdentifier = publicIdentifier2,
    from: PublicIdentifier = publicIdentifier,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: BigNumberString = BigNumberString("0"),
  ): PullPayment {
    return new PullPayment(
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
      BigNumberString("0"),
      gatewayUrl,
      paymentDetails,
      null,
      amount,
      BigNumberString("0"),
      BigNumberString("0"), // vestedAmount
      1, // deltaTime
      BigNumberString("1"), // deltaAmount
      [], // ledger
    );
  }
}

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
      gatewayUrl,
      null,
    );

    // Assert
    expect(response).toBeDefined();
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(
      paymentServiceMock.proposedPushPayment,
    );
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentSent: 1,
    });
  });

  test("offerReceived generates no events when we sent the offer", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("offerReceived generates an event when we received the offer", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const pushPayment = paymentServiceMock.factoryPushPayment(
      publicIdentifier,
      publicIdentifier2,
    );
    paymentServiceMock.setExistingPayments([pushPayment]);
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.offerReceived(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentReceived: 1,
      onBalancesChanged: 1,
    });
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
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidPaymentError);
    paymentServiceMock.contextProvider.assertEventCounts({});
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onBalancesChanged: 1,
    });
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
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("Should acceptOffers return error if freeAmount is less than totalStakeRequired", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks(BigNumberString("13"));
    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.acceptOffers([paymentId]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InsufficientBalanceError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });

  test("acceptOffers should return successfully with an error in the results if provideStake fails", async () => {
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onBalancesChanged: 1,
    });
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

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 2,
      onBalancesChanged: 0,
    });
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
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidPaymentError);
    paymentServiceMock.contextProvider.assertEventCounts({});
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

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.stakePosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
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
    expect(updatedPushPayments[1]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 2,
    });
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

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(paymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBeUndefined();
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
  });

  test("Should paymentPosted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentPosted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.proposedPushPayment,
    );
  });

  test("Should paymentCompleted return error if payment is null", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const paymentService = paymentServiceMock.factoryPaymentService();

    // Act
    const result = await paymentService.paymentCompleted(nonExistentPaymentId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentUpdated: 1,
    });
    expect(receivedPushPayments[0]).toBe(
      paymentServiceMock.finalizedPushPayment,
    );
  });

  test("Should advancePayments pass and trigger onPushPaymentDelayed if payment gateway is inactive", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();

    const payment = paymentServiceMock.factoryPushPayment(
      publicIdentifier2,
      publicIdentifier,
    );
    paymentServiceMock.setExistingPayments([payment]);
    paymentServiceMock.setGatewayStatus(gatewayUrl, false);
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
    paymentServiceMock.contextProvider.assertEventCounts({
      onPushPaymentDelayed: 1,
      onBalancesChanged: 1,
    });
    expect(delayedPushPayments[0]).toStrictEqual(
      paymentServiceMock.proposedPushPayment,
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
    paymentServiceMock.contextProvider.assertEventCounts({});
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
    paymentServiceMock.contextProvider.assertEventCounts({});
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
    acceptedPayment.amountStaked = BigNumberString("10");
    paymentServiceMock.setExistingPayments([acceptedPayment]);

    // Act
    const result = await paymentService.resolveInsurance(acceptedPayment.id);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(InvalidParametersError);
    paymentServiceMock.contextProvider.assertEventCounts({});
  });
});
