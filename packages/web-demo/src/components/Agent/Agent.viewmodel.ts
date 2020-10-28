import * as ko from "knockout";
import html from "./Agent.template.html";
import { LinkParams } from "../Link/Link.viewmodel";
import { HypernetCore, IHypernetCore, BigNumber } from "@hypernetlabs/hypernet-core";
import { ButtonParams } from "../Button/Button.viewmodel";
import { ProposedLinkParams } from "../ProposedLink/ProposedLink.viewmodel";
import { EProposedLinkStatus } from "web-demo/src/types/EProposedLinkStatus";

export class AgentViewModel {
  public links: ko.ObservableArray<LinkParams>;
  public proposedLinks: ko.ObservableArray<ProposedLinkParams>;
  public accounts: ko.ObservableArray<string>;
  public account: ko.PureComputed<string | null>;
  public remoteAccount: ko.PureComputed<string | null>;
  public clearLinks: ButtonParams;
  public establishLink: ButtonParams;
  public message: ko.Observable<string>;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;

  protected core: IHypernetCore;

  constructor() {
    this.core = new HypernetCore();

    this.core.onLinkUpdated.subscribe({
      next: (link) => {
        const linkParams = this.links();
        let matchFound = false;
        for (const linkParam of linkParams) {
          if (linkParam.link().id === link.id) {
            linkParam.link(link);
            matchFound = true;
          }
        }
        if (!matchFound) {
          this.links.push(new LinkParams(ko.observable(link)))
        }
        this.message("onLinkUpdated");
      },
    });
    this.core.onLinkRequestReceived.subscribe({
      next: (linkRequest) => {
        const status = ko.observable<EProposedLinkStatus>(EProposedLinkStatus.Proposed);
        this.proposedLinks.push(new ProposedLinkParams(linkRequest, status));
        this.message("onLinkRequestReceived");
      },
    });
    this.core.onLinkRejected.subscribe({
      next: (linkRequest) => {
        console.log(linkRequest);
        this.message("onLinkRejected");
      },
    });
    this.core.onControlClaimed.subscribe({
      next: () => {
        this.inControl(true);
      }
    });
    this.core.onControlYielded.subscribe({
      next: () => {
        this.inControl(false);
      }
    })

    this.links = ko.observableArray<LinkParams>();
    this.proposedLinks = ko.observableArray<ProposedLinkParams>();
    this.accounts = ko.observableArray<string>();
    this.message = ko.observable<string>("Starting");
    this.startupComplete = ko.observable(false);
    this.inControl = ko.observable(false);

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

    this.establishLink = new ButtonParams("New Link", async () => {
      const account = this.account();
      const remoteAccount = this.remoteAccount();
      if (account == null || remoteAccount == null) {
        this.message(`Establish link aborted. Account: ${account}, remoteAccount: ${remoteAccount}`);
        return;
      }

      this.message(`Establishing link with ${remoteAccount}`);
      const newLink = await this.core.openLink(remoteAccount, "asdfasdf", new BigNumber(10), "dispute-mediator-public-key", null);
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
      if (this.account() === "0xd128ACc1418DD9BD7809806b3B428b758E3722cC")
        return "0xB6ECBa743E9fa53998Bc1F1265adf87F5CCaDc85";

      return "0xd128ACc1418DD9BD7809806b3B428b758E3722cC";
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
