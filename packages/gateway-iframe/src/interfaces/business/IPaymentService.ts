import {
  ISignedSendFundsRequest,
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  IInitiateAuthorizeFundsRequest,
  IInitiateSendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  EPaymentType,
  PaymentId,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPaymentService {
  initiateSendFunds(
    request: IInitiateSendFundsRequest,
  ): ResultAsync<void, never>;
  sendFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never>;
  sendFunds(request: ISignedSendFundsRequest): ResultAsync<void, never>;

  initiateAuthorizeFunds(
    request: IInitiateAuthorizeFundsRequest,
  ): ResultAsync<void, never>;
  authorizeFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never>;
  authorizeFunds(
    request: ISignedAuthorizeFundsRequest,
  ): ResultAsync<void, never>;

  resolveInsurance(request: IResolveInsuranceRequest): ResultAsync<void, Error>;
  getPayment(
    paymentId: PaymentId,
    callback: (
      payment: PushPayment | PullPayment | null,
      paymentType: EPaymentType,
    ) => void,
  );
  paymentReceived(
    paymentId: PaymentId,
    payment: PushPayment | PullPayment | null,
    paymentType: EPaymentType,
  ): ResultAsync<void, never>;
}

export const IPaymentServiceType = Symbol.for("IPaymentService");
