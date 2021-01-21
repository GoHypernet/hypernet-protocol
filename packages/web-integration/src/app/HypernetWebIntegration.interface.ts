import { AssetBalanceViewModel } from "../viewModel";

export interface IHypernetWebIntegration {
  renderBalances(selector?: string): void;
  renderTransactionList(selector?: string): void;
  ready: Promise<void>;
  getBlances(): Promise<AssetBalanceViewModel[]>;
}
