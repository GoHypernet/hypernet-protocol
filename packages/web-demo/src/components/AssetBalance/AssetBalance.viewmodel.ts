import * as ko from "knockout";
import { AssetBalance } from "@hypernetlabs/hypernet-core";
import html from "./AssetBalance.template.html";

export class AssetBalanceParams {
  constructor(public assetBalance: AssetBalance) { }
}

// tslint:disable-next-line: max-classes-per-file
export class AssetBalanceViewModel {
  public assetAddresss: string;
  public totalAmount: string;
  public lockedAmount: string;
  public freeAmount: string;

  constructor(params: AssetBalanceParams) {
    this.assetAddresss = params.assetBalance.assetAddresss;
    this.totalAmount = params.assetBalance.totalAmount.toString();
    this.lockedAmount = params.assetBalance.lockedAmount.toString();
    this.freeAmount = params.assetBalance.freeAmount.toString();
  }
}

ko.components.register("asset-balance", {
  viewModel: AssetBalanceViewModel,
  template: html,
});
