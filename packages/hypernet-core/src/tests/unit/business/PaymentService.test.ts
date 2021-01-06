import { mock, instance, when } from "ts-mockito";
import moment from "moment";

import { BigNumber, InitializedHypernetContext, Payment, PushPayment } from "@interfaces/objects";
import { PaymentService } from "@implementations/business";
import { EPaymentState } from "@interfaces/types";
import { VectorLinkRepository, AccountsRepository, PaymentRepository } from "@implementations/data";
import { ContextProvider, ConfigProvider } from "@implementations/utilities";

let vectorLinkRepository: VectorLinkRepository;
let vectorLinkRepositoryInstance: VectorLinkRepository;

let accountsRepository: AccountsRepository;
let accountsRepositoryInstance: AccountsRepository;

let contextProvider: ContextProvider;
let contextProviderInstance: ContextProvider;

let configProvider: ConfigProvider;
let configProviderInstance: ConfigProvider;

let paymentRepository: PaymentRepository;
let paymentRepositoryInstance: PaymentRepository;

let paymentService: PaymentService;

const publicIdentifier = "VectorPublicIdentifier";
const amount = "42";
const paymentExpirationDate = Number(new Date());
const requiredStake = "42";
const amountStaked = BigNumber.from("42");
const paymentToken = "ethereumAddress";
const disputeMediator = "disputeMediator";
const paymentId = "paymentId";
const expirationDate = moment(moment().format());
const to = "to";
const from = "from";
const state = EPaymentState.Staked;
const finalized = false;
const paymentRequiredStake = BigNumber.from("42");
const createdTimestamp = moment(moment().format());
const updatedTimestamp = moment(moment().format());
const collateralRecovered = BigNumber.from("42");
const paymentAmount = BigNumber.from("42");

describe("PaymentService tests", () => {
  beforeEach(() => {
    // Arrange
    vectorLinkRepository = mock(VectorLinkRepository);
    vectorLinkRepositoryInstance = instance(vectorLinkRepository);

    accountsRepository = mock(AccountsRepository);
    accountsRepositoryInstance = instance(accountsRepository);

    contextProvider = mock(ContextProvider);
    contextProviderInstance = instance(contextProvider);

    configProvider = mock(ConfigProvider);
    configProviderInstance = instance(configProvider);

    paymentRepository = mock(PaymentRepository);
    paymentRepositoryInstance = instance(paymentRepository);

    paymentService = new PaymentService(
      vectorLinkRepositoryInstance,
      accountsRepositoryInstance,
      contextProviderInstance,
      configProviderInstance,
      paymentRepositoryInstance,
    );
  });

  test("Should sendFunds return payment", async () => {
    // Arrange
    const payment = new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    // Act
    when(
      paymentRepository.createPushPayment(
        publicIdentifier,
        amount,
        expirationDate,
        requiredStake,
        paymentToken,
        disputeMediator,
      ),
    ).thenResolve(payment);

    // Assert
    expect(
      await paymentService.sendFunds(
        publicIdentifier,
        amount,
        expirationDate,
        requiredStake,
        paymentToken,
        disputeMediator,
      ),
    ).toStrictEqual(payment);
  });

  test("Should offerReceived [WIP]", async () => {
    // Arrange
    /* const initializedHypernetContext = mock(InitializedHypernetContext);
    const initializedHypernetContextInstance = instance(initializedHypernetContext);

    const payment = new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      paymentRequiredStake,
      amountStaked,
      paymentExpirationDate,
      finalized,
      createdTimestamp,
      updatedTimestamp,
      collateralRecovered,
      disputeMediator,
      paymentAmount,
    );

    let myMap = new Map();
    myMap.set(paymentId, payment);

    // Act
    when(paymentRepository.getPaymentsByIds([paymentId])).thenResolve(myMap);
    when(contextProvider.getInitializedContext()).thenResolve(initializedHypernetContextInstance);
    when(initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());

    await paymentService.offerReceived(paymentId); */
    // Assert
    //verify(paymentRepository.getPaymentsByIds([paymentId])).once();
    //expect(await paymentService.offerReceived(paymentId)).toStrictEqual(payment);
  });
});
