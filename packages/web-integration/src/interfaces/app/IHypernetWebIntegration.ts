import { PublicIdentifier, EthereumAddress, PublicKey, EPaymentType, ResultAsync } from "@hypernetlabs/hypernet-core";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

export interface IRenderParams {
  selector?: string;
  showInModal?: boolean;
}

export interface IConnectorAuthorizationFlowParams extends IRenderParams {
  connectorUrl: string;
  connectorName?: string;
  connectorLogoUrl?: string;
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
  getReady: () => ResultAsync<IHypernetIFrameProxy, Error>;
  proxy: IHypernetIFrameProxy;
  renderBalancesWidget(params?: IRenderParams): void;
  renderFundWidget(params?: IRenderParams): void;
  renderLinksWidget(params?: IRenderParams): void;
  renderPaymentWidget(params?: IRenderPaymentWidgetParams): void;
  renderConnectorAuthorizationFlow(params: IConnectorAuthorizationFlowParams): void;
}
