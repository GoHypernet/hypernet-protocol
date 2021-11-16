import { PaymentId } from "@hypernetlabs/objects";

export class PaymentInitiationResponse {
  constructor(public requestIdentifier: string, public paymentId: PaymentId) {}
}
