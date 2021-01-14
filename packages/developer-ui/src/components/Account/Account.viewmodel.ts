import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import * as ko from "knockout";
import html from "./Account.template.html";

export class AccountParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AccountViewModel {
  public publicIdentifier: ko.Observable<string>;

  protected core: IHypernetCore;

  constructor(params: AccountParams) {
    this.core = params.core;
    this.publicIdentifier = ko.observable("");

    this.core
      .waitInitialized()
      .andThen(() => {
        return this.core.getPublicIdentifier();
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
