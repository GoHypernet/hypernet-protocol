import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { AssetBalance, Balances } from "@hypernetlabs/hypernet-core";
import html from "./Balances.template.html";
import { AssetBalanceParams } from "../AssetBalance/AssetBalance.viewmodel";

export class BalancesParams {
  constructor(public core: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class BalancesViewModel {
  public balances: ko.ObservableArray<AssetBalanceParams>;

  protected core: IHypernetWebIntegration;

  constructor(params: BalancesParams) {
    this.core = params.core;

    this.balances = ko.observableArray();

    this.core.proxy.onBalancesChanged.subscribe({
      next: (val) => {
        this.updateBalances(val);
      },
    });

    this.core
      .getReady()
      .andThen(() => {
        return this.core.proxy.getBalances();
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
