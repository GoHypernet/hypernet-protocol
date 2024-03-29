import {
  EPaymentType,
  GatewayUrl,
  PublicIdentifier,
  EthereumAddress,
  RenderError,
  RegistryTokenId,
  RegistryName,
} from "@hypernetlabs/objects";
import { Result } from "neverthrow";
import React from "react";

export interface IRenderParams {
  selector?: string;
  showInModal?: boolean;
  noHeader?: boolean;
  noLabel?: boolean;
  excludeCardWrapper?: boolean;
  bodyStyle?: React.CSSProperties;
  closeCallback?: () => void;
  hideLoadingSpinner?: boolean;
}

export interface IConnectorAuthorizationFlowParams extends IRenderParams {
  connectorUrl: GatewayUrl;
  connectorName?: string;
  connectorLogoUrl?: string;
}

export interface IOnboardingSuccessButtonProps {
  label: string;
  action: () => void;
}

export interface IOnboardingFlowParams extends IRenderParams {
  gatewayUrl: GatewayUrl;
  gatewayName?: string;
  gatewayLogoUrl?: string;
  renderGatewayApprovalContent?: () => React.ReactNode;
  launchpadUrl?: string;
  successButtonProps?: IOnboardingSuccessButtonProps;
}

export interface IRenderPaymentWidgetParams extends IRenderParams {
  selector: string;
  counterPartyAccount: PublicIdentifier;
  amount: string;
  expirationDate: number;
  requiredStake: string;
  paymentTokenAddress: EthereumAddress;
  gatewayUrl: GatewayUrl;
  paymentType: EPaymentType;
}

export interface IProposalsWidgetParams extends IRenderParams {
  onProposalCreationNavigate?: () => void;
  onProposalDetailsNavigate?: (proposalId: string) => void;
}

export interface IProposalDetailWidgetParams extends IRenderParams {
  onProposalListNavigate?: () => void;
  proposalId: string;
}

export interface IProposalCreateWidgetParams extends IRenderParams {
  onProposalListNavigate?: () => void;
}

export interface IRegistryListWidgetParams extends IRenderParams {
  onRegistryEntryListNavigate?: (registryName: RegistryName) => void;
  onRegistryDetailNavigate?: (registryName: RegistryName) => void;
  onLazyMintRequestsNavigate?: () => void;
}

export interface IRegistryEntryListWidgetParams extends IRenderParams {
  onRegistryEntryDetailsNavigate?: (
    registryName: RegistryName,
    entryTokenId: RegistryTokenId,
  ) => void;
  onRegistryListNavigate?: () => void;
  registryName: RegistryName;
}

export interface IRegistryEntryDetailWidgetParams extends IRenderParams {
  onRegistryEntryListNavigate?: (registryName: RegistryName) => void;
  registryName: RegistryName;
  entryTokenId: RegistryTokenId;
}

export interface IRegistryDetailWidgetParams extends IRenderParams {
  onRegistryListNavigate?: () => void;
  registryName: RegistryName;
}

export interface IHypernetWebUI {
  renderPrivateKeysModal(): Result<void, RenderError>;
  renderWarningAlertModal(errorMessage?: string): Result<void, RenderError>;
  renderMetamaskWarningModal(): Result<void, RenderError>;

  renderConnectedAccountWidget(
    params?: IRenderParams,
  ): Result<void, RenderError>;
  renderWalletConnectWidget(config: IRenderParams): Result<void, RenderError>;

  renderChainSelectorWidget(params?: IRenderParams): Result<void, RenderError>;

  payments: IHypernetPaymentsWebUI;

  governance: IHypernetGovernanceWebUI;

  registries: IHypernetRegistriesWebUI;
}

export interface IHypernetPaymentsWebUI {
  renderBalancesWidget(params?: IRenderParams): Result<void, RenderError>;
  renderGatewaysWidget(params?: IRenderParams): Result<void, RenderError>;
  renderFundWidget(params?: IRenderParams): Result<void, RenderError>;
  renderWithdrawWidget(params?: IRenderParams): Result<void, RenderError>;
  renderLinksWidget(params?: IRenderParams): Result<void, RenderError>;
  renderPublicIdentifierWidget(
    params?: IRenderParams,
  ): Result<void, RenderError>;
  renderStateChannelsWidget(params?: IRenderParams): Result<void, RenderError>;
  renderBalancesSummaryWidget(
    params?: IRenderParams,
  ): Result<void, RenderError>;
  renderPaymentWidget(
    params?: IRenderPaymentWidgetParams,
  ): Result<void, RenderError>;
  renderConnectorAuthorizationFlow(
    params: IConnectorAuthorizationFlowParams,
  ): Result<void, RenderError>;
  startOnboardingFlow(params: IOnboardingFlowParams): Result<void, RenderError>;
  renderPaymentsMetamaskInstructionsWidget(
    config: IRenderParams,
  ): Result<void, RenderError>;
}

export interface IHypernetGovernanceWebUI {
  renderProposalsWidget(
    config?: IProposalsWidgetParams,
  ): Result<void, RenderError>;
  renderProposalDetailWidget(
    config?: IProposalDetailWidgetParams,
  ): Result<void, RenderError>;
  renderProposalCreateWidget(
    config?: IProposalCreateWidgetParams,
  ): Result<void, RenderError>;
  renderHypertokenBalanceWidget(
    params?: IRenderParams,
  ): Result<void, RenderError>;
  renderVotingPowerWidget(params?: IRenderParams): Result<void, RenderError>;
}

export interface IHypernetRegistriesWebUI {
  renderRegistryListWidget(
    config?: IRegistryListWidgetParams,
  ): Result<void, RenderError>;
  renderRegistryDetailWidget(
    config?: IRegistryDetailWidgetParams,
  ): Result<void, RenderError>;
  renderRegistryEntryListWidget(
    config?: IRegistryEntryListWidgetParams,
  ): Result<void, RenderError>;
  renderRegistryEntryDetailWidget(
    config?: IRegistryEntryDetailWidgetParams,
  ): Result<void, RenderError>;
  renderRegistryLazyMintingRequestsWidget(
    config?: IRenderParams,
  ): Result<void, RenderError>;
}
