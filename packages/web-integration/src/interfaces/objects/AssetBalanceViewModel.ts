import Web3 from "web3";

import { AssetBalance } from "@hypernetlabs/hypernet-core";

export class AssetBalanceParams {
  constructor(public assetBalance: AssetBalance) {}
}

export class AssetBalanceViewModel {
  public assetAddress: string;
  public totalAmount: string;
  public lockedAmount: string;
  public freeAmount: string;

  constructor(params: AssetBalanceParams) {
    this.assetAddress = params.assetBalance.assetAddresss;
    this.totalAmount = Web3.utils.fromWei(params.assetBalance.totalAmount._hex);
    this.lockedAmount = Web3.utils.fromWei(params.assetBalance.lockedAmount._hex);
    this.freeAmount = Web3.utils.fromWei(params.assetBalance.freeAmount._hex);
  }
}
