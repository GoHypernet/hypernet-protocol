import ko from "knockout";
import { AssetBalance } from "@hypernetlabs/hypernet-core";
import html from "./AssetBalance.template.html";
import Web3 from "web3";

export class AssetBalanceParams {
  constructor(public assetBalance: AssetBalance) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AssetBalanceViewModel {
  public assetAddress: string;
  public totalAmount: string;
  public lockedAmount: string;
  public freeAmount: string;

  constructor(params: AssetBalanceParams) {
    this.assetAddress = params.assetBalance.assetAddresss;
    this.totalAmount = Web3.utils.fromWei(params.assetBalance.totalAmount.toString());
    this.lockedAmount = Web3.utils.fromWei(params.assetBalance.lockedAmount.toString());
    this.freeAmount = Web3.utils.fromWei(params.assetBalance.freeAmount.toString());
  }
}

ko.components.register("asset-balance", {
  viewModel: AssetBalanceViewModel,
  template: html,
});
