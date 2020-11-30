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

    this.init();
  }

  protected async init() {
    const publicIdentifier = await this.core.getPublicIdentifier();
    this.publicIdentifier(publicIdentifier);


    // const accounts = await this.core.getEthereumAccounts();

    // console.log(`Using account ${accounts[0]}`);

    // const account = this.availableAccounts.find((val) => {
    //   return val.accountAddress == accounts[0];
    // });

    // if (account == null) {
    //   throw new Error("Chosen MetaMask account is not supported!");
    // }

    // this.account(account);

    // console.log(account);
  }
}

ko.components.register("account", {
  viewModel: AccountViewModel,
  template: html,
});




