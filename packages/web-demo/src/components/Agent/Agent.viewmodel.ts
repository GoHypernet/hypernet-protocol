import * as ko from "knockout";
import html from "./Agent.template.html";
import { LinkParams } from "../Link/Link.viewmodel";
import { HypernetCore, IHypernetCore } from "@hypernetlabs/hypernet-core";
import { ButtonParams } from "../Button/Button.viewmodel";

export class AgentViewModel {
  public links: ko.ObservableArray<LinkParams>;
  public accounts: ko.ObservableArray<string>;
  public account: ko.PureComputed<string | null>;
  public remoteAccount: ko.PureComputed<string | null>;
  public clearLinks: ButtonParams;
  public establishLink: ButtonParams;
  public message: ko.Observable<string>;
  public startupComplete: ko.Observable<boolean>;

  protected core: IHypernetCore;

  constructor() {
    this.core = new HypernetCore();
    this.links = ko.observableArray<LinkParams>();
    this.accounts = ko.observableArray<string>();
    this.message = ko.observable<string>("Starting");
    this.startupComplete = ko.observable(false);

    this.startup().then(() => {
      this.startupComplete(true);
      this.message("Startup Complete");
    });

    this.clearLinks = new ButtonParams("Clear Links", async () => {
      this.message("Clearing links");
      await this.core.clearLinks();
      this.links.removeAll();
      this.message("Links cleared");
    });

    this.establishLink = new ButtonParams("Establish Link", async () => {
      const account = this.account();
      const remoteAccount = this.remoteAccount();
      if (account == null || remoteAccount == null) {
        this.message(`Establish link aborted. Account: ${account}, remoteAccount: ${remoteAccount}`);
        return;
      }

      this.message(`Establishing link with ${remoteAccount}`);
      const newLink = await this.core.openLink(account, remoteAccount, "asdfasdf", "dispute-mediator-public-key", null);
      this.links.push(new LinkParams(ko.observable(newLink)));
      this.message(`Link established with ${remoteAccount}`);
    });

    this.account = ko.pureComputed(() => {
      if (this.accounts().length < 1) {
        return null;
      }
      return this.accounts()[0];
    });

    this.remoteAccount = ko.pureComputed<string | null>(() => {
      if (this.account() === "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")
        return "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";

      return "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
    });
  }

  protected async startup() {
    const accounts = await this.core.getAccounts();

    this.accounts(accounts);

    await this.core.initialize(accounts[0]);

    const links = await this.core.getLinks();
    const linkParams = new Array<LinkParams>();
    for (const link of links) {
      linkParams.push(new LinkParams(ko.observable(link)));
    }
    this.links(linkParams);
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
