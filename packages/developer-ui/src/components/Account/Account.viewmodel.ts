import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";
import html from "./Account.template.html";

export class AccountParams {
  constructor(public core: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AccountViewModel {
  public publicIdentifier: ko.Observable<string>;

  protected core: IHypernetWebIntegration;

  constructor(params: AccountParams) {
    this.core = params.core;
    this.publicIdentifier = ko.observable("");
    this.core
      .getReady()
      .andThen(() => {
        return this.core.proxy.getPublicIdentifier();
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
