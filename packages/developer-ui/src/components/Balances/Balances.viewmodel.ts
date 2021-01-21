import * as ko from "knockout";
import { AssetBalance, Balances, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./Balances.template.html";
import { AssetBalanceParams } from "../AssetBalance/AssetBalance.viewmodel";

export class BalancesParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class BalancesViewModel {
  public balances: ko.ObservableArray<AssetBalanceParams>;

  protected core: IHypernetCore;

  constructor(params: BalancesParams) {
    this.core = params.core;

    this.balances = ko.observableArray();

    this.core.onBalancesChanged.subscribe({
      next: (val) => {
        this.updateBalances(val);
      },
    });

    this.core
      .waitInitialized()
      .andThen(() => {
        return this.core.getBalances();
      })
      .map((balances) => {
        this.updateBalances(balances);
      });
  }

  protected updateBalances(balances: Balances) {
    const params = balances.assets.map((val: AssetBalance) => {
      console.log("val assetBalance: ", val);
      return new AssetBalanceParams(val);
    });

    this.balances(params);
  }
}

ko.components.register("balances", {
  viewModel: BalancesViewModel,
  template: html,
});
