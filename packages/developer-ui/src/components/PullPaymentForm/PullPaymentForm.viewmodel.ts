import ko from "knockout";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./PullPaymentForm.template.html";

export class PullPaymentFormParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PullPaymentFormViewModel {
  // constructor(params: PullPaymentFormParams) {}
}

ko.components.register("pull-payment-form", {
  viewModel: PullPaymentFormViewModel,
  template: html,
});
