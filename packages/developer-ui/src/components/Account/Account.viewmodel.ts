import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";
import html from "./Account.template.html";

export class AccountParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AccountViewModel {
  public publicIdentifier: ko.Observable<string>;

  protected integration: IHypernetWebIntegration;

  constructor(params: AccountParams) {
    this.integration = params.integration;
    this.publicIdentifier = ko.observable("");
    this.integration
      .getReady()
      .andThen(() => {
        return this.integration.core.getPublicIdentifier();
      })
      .map((publicIdentifier) => {
        this.publicIdentifier(publicIdentifier);
      });
  }
}

ko.components.register("account", {
  viewModel: AccountViewModel,
  template: html,
});
