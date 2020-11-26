import * as ko from "knockout";
import { AssetBalance, Balances, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./Balances.template.html";
import { AssetBalanceParams } from "../AssetBalance/AssetBalance.viewmodel";

export class BalancesParams {
  constructor(public core: IHypernetCore) { }
}

// tslint:disable-next-line: max-classes-per-file
export class BalancesViewModel {
  public balances: ko.ObservableArray<AssetBalanceParams>;

  protected core: IHypernetCore;

  constructor(params: BalancesParams) {
    this.core = params.core;

    this.balances = ko.observableArray();
  }

  protected async init(): Promise<void> {
    await this.core.initialized();
    const balances = await this.core.getBalances();

    const params = balances.assets.map((val: AssetBalance) => {
      return new AssetBalanceParams(val);
    });

    this.balances(params);

  }
}

ko.components.register("balances", {
  viewModel: BalancesViewModel,
  template: html,
});
