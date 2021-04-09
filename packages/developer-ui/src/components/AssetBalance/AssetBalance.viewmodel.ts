import ko from "knockout";
import { AssetBalance } from "@hypernetlabs/objects";
import html from "./AssetBalance.template.html";
import { utils } from "ethers";

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
    this.assetAddress = params.assetBalance.assetAddress;
    this.totalAmount = utils.formatUnits(params.assetBalance.totalAmount, "wei");
    this.lockedAmount = utils.formatUnits(params.assetBalance.lockedAmount, "wei");
    this.freeAmount = utils.formatUnits(params.assetBalance.freeAmount, "wei");
  }
}

ko.components.register("asset-balance", {
  viewModel: AssetBalanceViewModel,
  template: html,
});
