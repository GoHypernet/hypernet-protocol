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
  public threadAddress: ko.Computed<EthereumAddress | null>;

  constructor(params: LinkParams) {
    const link = params.link();
    this.id = `Link ${link.id}`;
    this.consumer = link.consumer;
    this.provider = link.provider;
    this.paymentToken = link.paymentToken;
    this.disputeMediator = link.disputeMediator;
    this.consumerTotalDeposit = ko.pureComputed(() => {
      return params.link().consumerTotalDeposit;
    });
    this.consumerBalance = ko.pureComputed(() => {
      return params.link().consumerBalance;
    });
    this.providerBalance = ko.pureComputed(() => {
      return params.link().providerBalance;
    });
    this.providerStake = ko.pureComputed(() => {
      return params.link().providerStake;
    });
    this.status = ko.pureComputed(() => {
      return params.link().status;
    });
    this.internalChannelId = ko.pureComputed(() => {
      return params.link().internalChannelId;
    });
    this.threadAddress = ko.pureComputed(() => {
      return params.link().threadAddress;
    });
  }
}

ko.components.register("link", {
  viewModel: LinkViewModel,
  template: html,
});
