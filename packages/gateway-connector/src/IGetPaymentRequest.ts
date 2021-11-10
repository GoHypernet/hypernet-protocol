import {
  PaymentId,
  PushPayment,
  PullPayment,
  EPaymentType,
} from "@hypernetlabs/objects";

export interface IGetPaymentRequest {
  paymentId: PaymentId;
  callback: (
    payment: PushPayment | PullPayment | null,
    paymentType: EPaymentType,
  ) => void;
}
