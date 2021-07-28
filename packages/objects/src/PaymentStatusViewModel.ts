import { EPaymentState } from "@objects/typing";

export class PaymentStatusParams {
  constructor(public state: EPaymentState) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentStatusViewModel {
  public state: string;

  constructor(params: PaymentStatusParams) {
    if (params.state === EPaymentState.Proposed) {
      this.state = "Proposed";
    } else if (params.state === EPaymentState.Rejected) {
      this.state = "Rejected";
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
    } else if (params.state === EPaymentState.Borked) {
      this.state = "Borked";
    } else if (params.state === EPaymentState.Canceled) {
      this.state = "Canceled";
    } else {
      console.error(params.state);
      this.state = "Unknown - update PaymentStatus.viewmodel";
    }
  }
}
