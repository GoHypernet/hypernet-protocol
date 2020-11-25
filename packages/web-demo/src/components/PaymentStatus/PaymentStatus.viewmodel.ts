import * as ko from "knockout";
import html from "./PaymentStatus.template.html";
import { EPaymentState } from "@hypernetlabs/hypernet-core";

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
    } else if (params.state === EPaymentState.Finalized) {
      this.state = "Finalized";
    } else {
      this.state = "Unknown";
    }
  }
}

ko.components.register("payment-status", {
  viewModel: PaymentStatusViewModel,
  template: html,
});
