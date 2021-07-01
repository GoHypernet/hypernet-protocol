import { PaymentId, Signature } from "@hypernetlabs/objects";

export interface IResolutionResult {
  paymentId: PaymentId;
  mediatorSignature: Signature;
  amount: string;
}
