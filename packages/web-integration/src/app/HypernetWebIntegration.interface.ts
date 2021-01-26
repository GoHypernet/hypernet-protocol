import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";

export interface IHypernetWebIntegration {
  getReady: () => Promise<IHypernetIFrameProxy>;
  proxy: IHypernetIFrameProxy;
  renderBalancesWidget(selector?: string): void;
  renderTransactionList(selector?: string): void;
  renderFundWidget(selector?: string): void;
  renderLinksWidget(selector?: string): void;
  startConnectorFlow(connector?: string): void;
}
