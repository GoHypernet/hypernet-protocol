import { PublicIdentifier, EthereumAddress } from "@hypernetlabs/objects";
import { EPaymentType } from "@hypernetlabs/objects/types";
import IHypernetIFrameProxy from "@web-integration-interfaces/proxy/IHypernetIFrameProxy";
import { ResultAsync } from "neverthrow";

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
  core: IHypernetIFrameProxy;
  renderBalancesWidget(params?: IRenderParams): void;
  renderFundWidget(params?: IRenderParams): void;
  renderLinksWidget(params?: IRenderParams): void;
  renderPaymentWidget(params?: IRenderPaymentWidgetParams): void;
  renderConnectorAuthorizationFlow(params: IConnectorAuthorizationFlowParams): void;
  displayMerchantIFrame(merchantUrl: string): void;
  closeMerchantIFrame(merchantUrl: string): void;
}
