import { BigNumberString, PaymentId, Signature } from "@hypernetlabs/objects";

export interface IResolveInsuranceRequest {
  paymentId: PaymentId;
  gatewaySignature: Signature | null;
  amount: BigNumberString;
}
