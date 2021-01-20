import ko from "knockout";
import { HypernetLink, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./Link.template.html";
import { PushPaymentParams } from "../PushPayment/PushPayment.viewmodel";
import { PullPaymentParams } from "../PullPayment/PullPayment.viewmodel";

export class LinkParams {
  constructor(public core: IHypernetCore, public link: HypernetLink) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinkViewModel {
  public counterpartyId: string;
  public pushPayments: ko.ObservableArray<PushPaymentParams>;
  public pullPayments: ko.ObservableArray<PullPaymentParams>;

  protected counterParty: string;
  protected core: IHypernetCore;

  constructor(params: LinkParams) {
    this.core = params.core;
    this.counterParty = params.link.counterPartyAccount;
    this.counterpartyId = `${params.link.counterPartyAccount}`;
    this.pushPayments = ko.observableArray<PushPaymentParams>();
    this.pullPayments = ko.observableArray<PullPaymentParams>();

    const pushPaymentParams = params.link.pushPayments.map((val) => {
      return new PushPaymentParams(this.core, val);
    });
    this.pushPayments.push(...pushPaymentParams);

    // tslint:disable-next-line: no-console
    console.log(`Pushed ${pushPaymentParams.length} push payment params`);

    const pullPaymentParams = params.link.pullPayments.map((val) => {
      return new PullPaymentParams(this.core, val);
    });
    this.pullPayments.push(...pullPaymentParams);

    // tslint:disable-next-line: no-console
    console.log(`Pushed ${pullPaymentParams.length} pull payment params`);

    this.core.onPullPaymentProposed.subscribe({
      next: (payment) => {
        if (payment.to === this.counterParty || payment.from === this.counterParty) {
          // It's for us, we'll need to add it to the payments for the link
          this.pullPayments.push(new PullPaymentParams(this.core, payment));
        }
      },
    });

    this.core.onPushPaymentProposed.subscribe({
      next: (payment) => {
        if (payment.to === this.counterParty || payment.from === this.counterParty) {
          // It's for us, we'll need to add it to the payments for the link
          this.pushPayments.push(new PushPaymentParams(this.core, payment));
        }
      },
    });
  }
}

ko.components.register("link", {
  viewModel: LinkViewModel,
  template: html,
});
