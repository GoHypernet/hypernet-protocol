import { AssetBalance } from "@hypernetlabs/objects";
import { utils } from "ethers";

export class AssetBalanceParams {
  constructor(public assetBalance: AssetBalance) {}
}

export class AssetBalanceViewModel {
  public assetAddress: string;
  public totalAmount: string;
  public lockedAmount: string;
  public freeAmount: string;

  constructor(params: AssetBalanceParams) {
    this.assetAddress = params.assetBalance.assetAddress;
    this.totalAmount = utils.formatUnits(
      params.assetBalance.totalAmount,
      "wei",
    );
    this.lockedAmount = utils.formatUnits(
      params.assetBalance.lockedAmount,
      "wei",
    );
    this.freeAmount = utils.formatUnits(params.assetBalance.freeAmount, "wei");
  }
}
