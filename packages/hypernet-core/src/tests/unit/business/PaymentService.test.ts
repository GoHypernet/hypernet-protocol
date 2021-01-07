import { verify, when } from "ts-mockito";
import { Subject } from "rxjs";
import moment from "moment";

import { BigNumber, PushPayment } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import PaymentServiceMocks from "../../mock/unit/business/PaymentServiceMocks";

const publicIdentifier = "VectorPublicIdentifier";
const amount = "42";
const paymentExpirationDate = Number(new Date());
const requiredStake = "42";
const amountStaked = BigNumber.from("42");
const paymentToken = "ethereumAddress";
const disputeMediator = "disputeMediator";
const paymentId = "paymentId1";
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
  test("Should sendFunds return payment", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
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
      paymentServiceMock.paymentRepository.createPushPayment(
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
      await paymentServiceMock
        .getServiceFactory()
        .sendFunds(publicIdentifier, amount, expirationDate, requiredStake, paymentToken, disputeMediator),
    ).toStrictEqual(payment);
  });

  /* test("Should offerReceived [WIP]", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
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

    const paymentsMap = new Map<string, PushPayment>([[paymentId, payment]]);

    // Act
    when(paymentServiceMock.contextProvider.getInitializedContext()).thenResolve(
      paymentServiceMock.getInitializedHypernetContextFactory(),
    );
    when(paymentServiceMock.initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());
    when(paymentServiceMock.paymentRepository.getPaymentsByIds([paymentId])).thenResolve(paymentsMap);

    await paymentServiceMock.getServiceFactory().offerReceived(paymentId);
    // Assert
    verify(paymentServiceMock.paymentRepository.getPaymentsByIds([paymentId])).once();
    //expect(await paymentService.offerReceived(paymentId)).toStrictEqual(payment);
  }); */
});
