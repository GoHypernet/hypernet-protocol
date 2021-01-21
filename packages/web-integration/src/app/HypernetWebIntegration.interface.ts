import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";

export interface IHypernetWebIntegration {
  getReady: () => Promise<IHypernetIFrameProxy>;
  proxy: IHypernetIFrameProxy;
  renderBalances(selector?: string): void;
  renderTransactionList(selector?: string): void;
}
