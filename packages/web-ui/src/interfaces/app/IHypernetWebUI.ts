import {
  EPaymentType,
  MerchantUrl,
  PublicIdentifier,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { RenderError } from "@hypernetlabs/objects";
import { Result } from "neverthrow";
import React from "react";

export interface IRenderParams {
  selector?: string;
  showInModal?: boolean;
  noLabel?: boolean;
  includeBoxWrapper?: boolean;
  bodyStyle?: React.CSSProperties;
  closeCallback?: () => void;
}

export interface IConnectorAuthorizationFlowParams extends IRenderParams {
  connectorUrl: MerchantUrl;
  connectorName?: string;
  connectorLogoUrl?: string;
}

export interface IOnboardingFlowParams extends IRenderParams {
  merchantUrl: MerchantUrl;
  merchantName?: string;
  merchantLogoUrl?: string;
  finalSuccessContent?: string;
}

export interface IRenderPaymentWidgetParams extends IRenderParams {
  selector: string;
  counterPartyAccount: PublicIdentifier;
  amount: string;
  expirationDate: number;
  requiredStake: string;
  paymentTokenAddress: EthereumAddress;
  merchantUrl: MerchantUrl;
  paymentType: EPaymentType;
}

export interface IHypernetWebUI {
  renderBalancesWidget(params?: IRenderParams): Result<void, RenderError>;
  renderMerchantsWidget(params?: IRenderParams): Result<void, RenderError>;
  renderFundWidget(params?: IRenderParams): Result<void, RenderError>;
  renderLinksWidget(params?: IRenderParams): Result<void, RenderError>;
  renderPaymentWidget(
    params?: IRenderPaymentWidgetParams,
  ): Result<void, RenderError>;
  renderConnectorAuthorizationFlow(
    params: IConnectorAuthorizationFlowParams,
  ): Result<void, RenderError>;
  startOnboardingFlow(params: IOnboardingFlowParams): Result<void, RenderError>;
  renderPrivateKeysModal(): Result<void, RenderError>;
}
