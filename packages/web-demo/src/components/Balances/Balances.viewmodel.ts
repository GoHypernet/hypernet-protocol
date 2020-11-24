import * as ko from "knockout";
import { AssetBalance, Balances } from "@hypernetlabs/hypernet-core";
import html from "./Balances.template.html";
import { AssetBalanceParams } from "../AssetBalance/AssetBalance.viewmodel";

export class BalancesParams {
  constructor(public balances: ko.Observable<Balances>) { }
}

// tslint:disable-next-line: max-classes-per-file
export class BalancesViewModel {
  public balances: ko.PureComputed<AssetBalanceParams[]>;

  protected source: ko.Observable<Balances>;

  constructor(params: BalancesParams) {
    this.source = params.balances;
    
    this.balances = ko.pureComputed(() => {
      const source = this.source();

      return source.assets.map((val: AssetBalance) => {
        return new AssetBalanceParams(val);
      });
    });
  }
}

ko.components.register("link", {
  viewModel: BalancesViewModel,
  template: html,
});
