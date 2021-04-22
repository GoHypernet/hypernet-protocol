import { PublicIdentifier, EthereumAddress } from "@hypernetlabs/objects";
import { EPaymentType, MerchantUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import IHypernetIFrameProxy from "@web-integration-interfaces/proxy/IHypernetIFrameProxy";

export interface IRenderParams {
  selector?: string;
  showInModal?: boolean;
}

export interface IConnectorAuthorizationFlowParams extends IRenderParams {
  connectorUrl: MerchantUrl;
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
  merchantUrl: MerchantUrl;
  paymentType: EPaymentType;
}

export interface IHypernetWebIntegration {
  getReady: () => ResultAsync<IHypernetIFrameProxy, Error>;
  core: IHypernetIFrameProxy;
  renderBalancesWidget(params?: IRenderParams): void;
  renderFundWidget(params?: IRenderParams): void;
  renderLinksWidget(params?: IRenderParams): void;
  renderPaymentWidget(params?: IRenderPaymentWidgetParams): void;
  renderConnectorAuthorizationFlow(
    params: IConnectorAuthorizationFlowParams,
  ): void;
  displayMerchantIFrame(merchantUrl: MerchantUrl): void;
  closeMerchantIFrame(merchantUrl: MerchantUrl): void;
}
