import * as ko from "knockout";
import {
  HypernetLink,
  EthereumAddress,
  PublicKey,
  BigNumber,
  PushPayment,
  PullPayment,
} from "@hypernetlabs/hypernet-core";
import html from "./Link.template.html";
import { PushPaymentParams } from "../PushPayment/PushPayment.viewmodel";
import { PullPaymentParams } from "../PullPayment/PullPayment.viewmodel";

export class LinkParams {
  constructor(public link: ko.Observable<HypernetLink>) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinkViewModel {
  public counterpartyId: ko.Computed<string>;
  public pushPayments: ko.Computed<PushPaymentParams[]>;
  public pullPayments: ko.Computed<PullPaymentParams[]>;

  protected link: ko.Observable<HypernetLink>;

  constructor(params: LinkParams) {
    this.link = params.link;
    this.counterpartyId = ko.pureComputed(() => {
      return `Counterparty ID ${this.link().counterPartyAccount}`;
    });

    this.pushPayments = ko.pureComputed(() => {
      const link = this.link();

      return link.pushPayments.map((val: PushPayment) => {
        return new PushPaymentParams(ko.observable(val));
      });
    });

    this.pullPayments = ko.pureComputed(() => {
      const link = this.link();

      return link.pullPayments.map((val: PullPayment) => {
        return new PullPaymentParams(ko.observable(val));
      });
    });
  }
}

ko.components.register("link", {
  viewModel: LinkViewModel,
  template: html,
});
