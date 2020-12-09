import * as ko from "knockout";
import { HypernetLink, IHypernetCore, PublicIdentifier } from "@hypernetlabs/hypernet-core";
import html from "./Links.template.html";
import { LinkParams } from "../Link/Link.viewmodel";

export class LinksParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinksViewModel {
  public links: ko.ObservableArray<LinkParams>;

  protected core: IHypernetCore;
  protected publicIdentifier: ko.Observable<PublicIdentifier>;

  constructor(params: LinksParams) {
    this.core = params.core;
    this.publicIdentifier = ko.observable("");
    this.links = ko.observableArray<LinkParams>();

    this.core.onPullPaymentProposed.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const links = this.links().filter((val) => {
          const counterPartyAccount = val.link.counterPartyAccount;
          return counterPartyAccount === payment.to || counterPartyAccount === payment.from;
        });

        if (links.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount = payment.to === this.publicIdentifier() ? payment.from : payment.to;
          const link = new HypernetLink(counterPartyAccount, [payment], [], [payment], [], [payment]);
          this.links.push(new LinkParams(this.core, link));
        }

        // A link already exists for this counterparty, the link component will handle this
      },
    });

    this.core.onPushPaymentProposed.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const links = this.links().filter((val) => {
          const counterPartyAccount = val.link.counterPartyAccount;
          return counterPartyAccount === payment.to || counterPartyAccount === payment.from;
        });

        if (links.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount = payment.to === this.publicIdentifier() ? payment.from : payment.to;
          const link = new HypernetLink(counterPartyAccount, [payment], [payment], [], [payment], []);
          this.links.push(new LinkParams(this.core, link));
        }

        // A link already exists for this counterparty, the link component will handle this
      },
    });

    this.init();
  }

  protected async init() {
    await this.core.initialized();

    const publicIdentifier = await this.core.getPublicIdentifier();
    this.publicIdentifier(publicIdentifier);

    const links = await this.core.getActiveLinks();
    //console.log("Got active links!");
    const linkParams = links.map((link: HypernetLink) => new LinkParams(this.core, link));
    //console.log('Mapped link params!')
    this.links.push(...linkParams);
    //console.log('Pushed link params!')
  }
}

ko.components.register("links", {
  viewModel: LinksViewModel,
  template: html,
});
