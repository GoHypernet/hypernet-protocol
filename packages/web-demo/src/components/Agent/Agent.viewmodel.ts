import * as ko from "knockout";
import { HypernetLink, EthereumAddress, PublicKey, ELinkStatus, BigNumber } from "@hypernetlabs/hypernet-core";
import html from "./Agent.template.html";
import { LinkParams } from "../Link/Link.viewmodel";
import { HypernetCore } from "@hypernetlabs/hypernet-core";

export class AgentViewModel {
  public links: ko.ObservableArray<LinkParams>;
  public startupStatus: ko.Observable<string>;
  public accounts: ko.ObservableArray<string>;

  constructor() {
    this.links = ko.observableArray<LinkParams>();
    this.startupStatus = ko.observable("Starting");
    this.accounts = ko.observableArray<string>();

    this.startup().then(() => {
      this.startupStatus("Complete");
    });
  }

  protected async startup() {
    const core1 = new HypernetCore();
    const accounts = await core1.getAccounts();

    this.accounts(accounts);

    await core1.initialize(accounts[0]);

    const links = await core1.getLinks();
    const linkParams = new Array<LinkParams>();
    for (const link of links) {
      linkParams.push(new LinkParams(ko.observable(link)));
    }
    this.links(linkParams);

    const newLink = await core1.openLink(accounts[0], accounts[1], "asdfasdf", "dispute-mediator-public-key", null);
    this.links.push(new LinkParams(ko.observable(newLink)));
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
