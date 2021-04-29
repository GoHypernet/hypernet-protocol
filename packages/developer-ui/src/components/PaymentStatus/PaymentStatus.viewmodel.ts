import { EPaymentState } from "@hypernetlabs/objects";
import ko from "knockout";

import html from "./PaymentStatus.template.html";

export class PaymentStatusParams {
  constructor(public state: EPaymentState) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentStatusViewModel {
  public state: string;

  constructor(params: PaymentStatusParams) {
    if (params.state === EPaymentState.Proposed) {
      this.state = "Proposed";
    } else if (params.state === EPaymentState.InvalidProposal) {
      this.state = "Invalid Proposal";
    } else if (params.state === EPaymentState.Staked) {
      this.state = "Staked";
    } else if (params.state === EPaymentState.InvalidStake) {
      this.state = "Invalid Stake";
    } else if (params.state === EPaymentState.Approved) {
      this.state = "Approved";
    } else if (params.state === EPaymentState.InvalidFunds) {
      this.state = "Invalid Payment";
    } else if (params.state === EPaymentState.Accepted) {
      this.state = "Accepted";
    } else if (params.state === EPaymentState.InsuranceReleased) {
      this.state = "Insurance Released";
    } else if (params.state === EPaymentState.Finalized) {
      this.state = "Finalized";
    } else if (params.state === EPaymentState.Challenged) {
      this.state = "Challenged";
    } else if (params.state === EPaymentState.Borked) {
      this.state = "Borked";
    } else {
      this.state = "Unknown - update PaymentStatus.viewmodel";
    }
  }
}

ko.components.register("payment-status", {
  viewModel: PaymentStatusViewModel,
  template: html,
});
