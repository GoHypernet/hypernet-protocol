import * as ko from "knockout";
import { HypernetLink, EthereumAddress, PublicKey, ELinkStatus, BigNumber } from "@hypernetlabs/hypernet-core";
import html from "./Link.template.html";

export class LinkParams {
  constructor(public link: ko.Observable<HypernetLink>) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinkViewModel {
  public id: string;
  public consumer: EthereumAddress;
  public provider: EthereumAddress;
  public paymentToken: EthereumAddress;
  public disputeMediator: PublicKey;
  public consumerTotalDeposit: ko.Computed<BigNumber>;
  public consumerBalance: ko.Computed<BigNumber>;
  public providerBalance: ko.Computed<BigNumber>;
  public providerStake: ko.Computed<BigNumber>;
  public status: ko.Computed<ELinkStatus>;
  public internalChannelId: ko.Computed<string | null>;

  protected link: ko.Observable<HypernetLink>;

  constructor(params: LinkParams) {
    this.link = params.link;
    this.id = `Link ${this.link().id}`;
    this.consumer = this.link().consumer;
    this.provider = this.link().provider;
    this.paymentToken = this.link().paymentToken;
    this.disputeMediator = this.link().disputeMediator;

    this.consumerTotalDeposit = ko.pureComputed(() => {
      return this.link().consumerTotalDeposit;
    });
    this.consumerBalance = ko.pureComputed(() => {
      return this.link().consumerBalance;
    });
    this.providerBalance = ko.pureComputed(() => {
      return this.link().providerBalance;
    });
    this.providerStake = ko.pureComputed(() => {
      return this.link().providerStake;
    });
    this.status = ko.pureComputed(() => {
      return this.link().status;
    });
    this.internalChannelId = ko.pureComputed(() => {
      return this.link().internalChannelId;
    });
  }
}

ko.components.register("link", {
  viewModel: LinkViewModel,
  template: html,
});
