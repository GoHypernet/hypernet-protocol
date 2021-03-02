import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { AssetBalance, Balances } from "@hypernetlabs/hypernet-core";
import html from "./Balances.template.html";
import { AssetBalanceParams } from "../AssetBalance/AssetBalance.viewmodel";

export class BalancesParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class BalancesViewModel {
  public balances: ko.ObservableArray<AssetBalanceParams>;

  protected integration: IHypernetWebIntegration;

  constructor(params: BalancesParams) {
    this.integration = params.integration;

    this.balances = ko.observableArray();

    this.integration.core.onBalancesChanged.subscribe({
      next: (val) => {
        this.updateBalances(val);
      },
    });

    this.integration.core.waitInitialized()
      .andThen(() => {
        return this.integration.core.getBalances();
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
