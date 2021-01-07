import { when } from "ts-mockito";
import { Subject } from "rxjs";
import moment from "moment";

import { BigNumber, PushPayment, Payment } from "@interfaces/objects";
import { EPaymentState } from "@interfaces/types";
import PaymentServiceMocks from "../../mock/unit/business/PaymentServiceMocks";
import { mkPublicIdentifier } from "@connext/vector-utils";
const { when: jestWhen } = require("jest-when");
var randomstring = require("randomstring");

const publicIdentifier = mkPublicIdentifier();
const amount = "42";
const paymentExpirationDate = Number(new Date());
const requiredStake = "42";
const amountStaked = BigNumber.from("42");
const paymentToken = "0x" + randomstring.generate({ length: 40, charset: "hex" });
const disputeMediator = "0x" + randomstring.generate({ length: 40, charset: "hex" });
const paymentId = "0x" + randomstring.generate({ length: 64, charset: "hex" });
const expirationDate = moment(moment().format());
const to = "0x" + randomstring.generate({ length: 40, charset: "hex" });
const from = "0x" + randomstring.generate({ length: 40, charset: "hex" });
const state = EPaymentState.Proposed;
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
    jestWhen(paymentServiceMock.paymentRepository.prototype.createPushPayment)
      .calledWith(publicIdentifier, amount, expirationDate, requiredStake, paymentToken, disputeMediator)
      .mockResolvedValue(payment);

    // Assert
    expect(
      await paymentServiceMock
        .getServiceFactory()
        .sendFunds(publicIdentifier, amount, expirationDate, requiredStake, paymentToken, disputeMediator),
    ).toStrictEqual(payment);
  });

  test("Should offerReceived works without any errors if payment was found", async () => {
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

    const returnedPaymentsMap = new Map<string, Payment>([[paymentId, payment]]);

    // Act
    when(paymentServiceMock.contextProvider.getInitializedContext()).thenResolve(
      paymentServiceMock.getInitializedHypernetContextFactory(),
    );
    when(paymentServiceMock.initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockResolvedValue(returnedPaymentsMap);

    let error;
    try {
      await paymentServiceMock.getServiceFactory().offerReceived(paymentId);
    } catch (e) {
      error = e;
    }

    // Assert
    expect(error).toBeUndefined();
  });

  test("Should offerReceived return an error if payment was not found", async () => {
    // Arrange
    const paymentServiceMock = new PaymentServiceMocks();
    const returnedPaymentsMap = new Map<any, any>([[null, null]]);

    // Act
    when(paymentServiceMock.contextProvider.getInitializedContext()).thenResolve(
      paymentServiceMock.getInitializedHypernetContextFactory(),
    );
    when(paymentServiceMock.initializedHypernetContext.onPushPaymentProposed).thenReturn(new Subject<PushPayment>());
    jestWhen(paymentServiceMock.paymentRepository.prototype.getPaymentsByIds)
      .calledWith([paymentId])
      .mockResolvedValue(returnedPaymentsMap);

    let error;
    try {
      await paymentServiceMock.getServiceFactory().offerReceived(paymentId);
    } catch (e) {
      error = e;
    }

    const throwenError = new Error(`PaymentService:offerReceived():Could not get payment!`);

    // Assert
    expect(error).toEqual(throwenError);
  });
});
