import { PublicIdentifier, EthereumAddress, PublicKey, EPaymentType } from "@hypernetlabs/hypernet-core";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

export interface IRenderParams {
  selector: string;
}

export interface IConnectorRenderParams {
  connector: string;
}

export interface IRenderPaymentWidgetParams {
  selector: string;
  counterPartyAccount: PublicIdentifier;
  amount: string;
  expirationDate: number;
  requiredStake: string;
  paymentTokenAddress: EthereumAddress;
  merchantUrl: string;
  paymentType: EPaymentType;
}

export interface IHypernetWebIntegration {
  getReady: () => Promise<IHypernetIFrameProxy>;
  proxy: IHypernetIFrameProxy;
  renderBalancesWidget(params?: IRenderParams): void;
  renderFundWidget(params?: IRenderParams): void;
  renderLinksWidget(params?: IRenderParams): void;
  renderPaymentWidget(params?: IRenderPaymentWidgetParams): void;
  startConnectorFlow(params?: IConnectorRenderParams): void;
}
