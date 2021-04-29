import { HypernetLink, PublicIdentifier } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import { LinkParams } from "../Link/Link.viewmodel";

import html from "./Links.template.html";

export class LinksParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LinksViewModel {
  public links: ko.ObservableArray<LinkParams>;

  protected integration: IHypernetWebIntegration;
  protected publicIdentifier: ko.Observable<PublicIdentifier>;

  constructor(params: LinksParams) {
    this.integration = params.integration;
    this.publicIdentifier = ko.observable(PublicIdentifier(""));
    this.links = ko.observableArray<LinkParams>();

    this.integration.core.onPullPaymentSent.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const links = this.links().filter((val) => {
          const counterPartyAccount = val.link.counterPartyAccount;
          return (
            counterPartyAccount === payment.to ||
            counterPartyAccount === payment.from
          );
        });

        if (links.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount =
            payment.to === this.publicIdentifier() ? payment.from : payment.to;
          const link = new HypernetLink(
            counterPartyAccount,
            [payment],
            [],
            [payment],
            [],
            [payment],
          );
          this.links.push(new LinkParams(this.integration, link));
        }

        // A link already exists for this counterparty, the link component will handle this
      },
    });

    this.integration.core.onPushPaymentSent.subscribe({
      next: (payment) => {
        // Check if there is a link for this counterparty already
        const links = this.links().filter((val) => {
          const counterPartyAccount = val.link.counterPartyAccount;
          return (
            counterPartyAccount === payment.to ||
            counterPartyAccount === payment.from
          );
        });

        if (links.length === 0) {
          // We need to create a new link for the counterparty
          const counterPartyAccount =
            payment.to === this.publicIdentifier() ? payment.from : payment.to;
          const link = new HypernetLink(
            counterPartyAccount,
            [payment],
            [payment],
            [],
            [payment],
            [],
          );
          this.links.push(new LinkParams(this.integration, link));
        }

        // A link already exists for this counterparty, the link component will handle this
      },
    });

    this.init();
  }

  protected async init() {
    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getPublicIdentifier();
      })
      .andThen((publicIdentifier) => {
        this.publicIdentifier(publicIdentifier);

        return this.integration.core.getActiveLinks();
      })
      .map((links) => {
        const linkParams = links.map(
          (link: HypernetLink) => new LinkParams(this.integration, link),
        );
        this.links.push(...linkParams);
      });
  }
}

ko.components.register("links", {
  viewModel: LinksViewModel,
  template: html,
});
