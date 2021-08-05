import { PaymentId, Signature } from "@hypernetlabs/objects";

export interface IResolutionResult {
  paymentId: PaymentId;
  gatewaySignature: Signature;
  amount: string;
}
