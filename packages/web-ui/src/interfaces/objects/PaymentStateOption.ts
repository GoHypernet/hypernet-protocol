import { EPaymentState } from "@hypernetlabs/objects";

export class PaymentStateOption {
  constructor(public label: string, public value: EPaymentState | string) {}
}
