import {
  ChainId,
  IHypernetCore,
  IUIData,
  RenderError,
  Theme,
} from "@hypernetlabs/objects";
import MainContainer from "@web-ui/containers/MainContainer";
import {
  ThemeProvider,
  Box,
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { LayoutProvider, StoreProvider } from "@web-ui/contexts";
import {
  IConnectorAuthorizationFlowParams,
  IHypernetWebUI,
  IRenderParams,
  IRenderPaymentWidgetParams,
  IOnboardingFlowParams,
  IViewUtils,
  IDateUtils,
  IProposalsWidgetParams,
  IProposalCreateWidgetParams,
  IProposalDetailWidgetParams,
  IRegistryListWidgetParams,
  IRegistryEntryListWidgetParams,
  IRegistryEntryDetailWidgetParams,
  IRegistryDetailWidgetParams,
  IHypernetPaymentsWebUI,
  IHypernetGovernanceWebUI,
  IHypernetRegistriesWebUI,
} from "@web-ui/interfaces";
import GatewaysWidget from "@web-ui/widgets/GatewaysWidget";
import { Result } from "neverthrow";
import React from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";

import { MetamaskWarning, WarningAlert } from "@web-ui/components";
import {
  BALANCES_WIDGET_ID_SELECTOR,
  FUND_WIDGET_ID_SELECTOR,
  LINKS_WIDGET_ID_SELECTOR,
  PAYMENT_WIDGET_ID_SELECTOR,
  PRIVATE_KEYS_FLOW_ID_SELECTOR,
  CONNECTOR_AUTHORIZATION_FLOW_ID_SELECTOR,
  ONBOARDING_FLOW_ID_SELECTOR,
  WARNING_ALERT_SELECTOR,
  METAMASK_WARNING_ID_SELECTOR,
  PUBLIC_IDENTIFIER_WIDGET_ID_SELECTOR,
  WITHDRAW_WIDGET_ID_SELECTOR,
  STATE_CHANNELS_WIDGET_ID_SELECTOR,
  BALANCES_SUMMARY_WIDGET_ID_SELECTOR,
  PROPOSALS_WIDGET_ID_SELECTOR,
  PROPOSAL_CREATE_WIDGET_ID_SELECTOR,
  REGISTRY_LIST_WIDGET_ID_SELECTOR,
  REGISTRY_ENTRY_LIST_WIDGET_ID_SELECTOR,
  REGISTRY_ENTRY_DETAIL_WIDGET_ID_SELECTOR,
  HYPERTOKEN_BALANCE_WIDGET,
  VOTING_POWER_WIDGET,
  CONNECTED_ACCOUNT_WIDGET,
  CONNECT_WALLET_WIDGET_SELECTOR,
  REGISTRY_LAZY_MINTING_REQUESTS_WIDGET_ID_SELECTOR,
  CHAIN_SELECTOR_WIDGET_ID_SELECTOR,
} from "@web-ui/constants";
import ConnectorAuthorizationFlow from "@web-ui/flows/ConnectorAuthorizationFlow";
import OnboardingFlow from "@web-ui/flows/OnboardingFlow";
import PrivateKeysFlow from "@web-ui/flows/PrivateKeysFlow";
import { ViewUtils, DateUtils } from "@web-ui/utils";
import BalancesWidget from "@web-ui/widgets/BalancesWidget";
import BalancesSummaryWidget from "@web-ui/widgets/BalancesSummaryWidget";
import FundWidget from "@web-ui/widgets/FundWidget";
import WithdrawWidget from "@web-ui/widgets/WithdrawWidget";
import LinksWidget from "@web-ui/widgets/LinksWidget";
import { PaymentWidget } from "@web-ui/widgets/PaymentWidget";
import PublicIdentifierWidget from "@web-ui/widgets/PublicIdentifierWidget";
import StateChannelsWidget from "@web-ui/widgets/StateChannelsWidget";
import ProposalsWidget from "@web-ui/widgets/ProposalsWidget";
import CreateProposalWidget from "@web-ui/widgets/CreateProposalWidget";
import ProposalDetailWidget from "@web-ui/widgets/ProposalDetailWidget";
import RegistryListWidget from "@web-ui/widgets/RegistryListWidget";
import RegistryEntryDetailWidget from "@web-ui/widgets/RegistryEntryDetailWidget";
import RegistryDetailWidget from "@web-ui/widgets/RegistryDetailWidget";
import RegistryEntryListWidget from "@web-ui/widgets/RegistryEntryListWidget";
import HypertokenBalanceWidget from "@web-ui/widgets/HypertokenBalanceWidget";
import VotingPowerWidget from "@web-ui/widgets/VotingPowerWidget";
import ConnectedAccountWidget from "@web-ui/widgets/ConnectedAccountWidget";
import WalletConnectWidget from "@web-ui/widgets/WalletConnectWidget";
import RegistryLazyMintingRequestsWidget from "@web-ui/widgets/RegistryLazyMintingRequestsWidget";
import ChainSelectorWidget from "@web-ui/widgets/ChainSelectorWidget";
import {
  lightTheme,
  darkTheme,
  injectCustomPaletteToTheme,
} from "@web-ui/theme";

export default class HypernetWebUI implements IHypernetWebUI {
  private static instance: IHypernetWebUI;
  protected coreInstance: IHypernetCore;
  protected UIData: IUIData;
  protected viewUtils: IViewUtils;
  protected dateUtils: IDateUtils;
  protected defaultGovernanceChainId: ChainId;
  protected theme: Theme | null = null;
  constructor(
    _coreInstance: IHypernetCore,
    _UIData: IUIData,
    iframeURL: string | null,
    defaultGovernanceChainId: number | null,
    theme: Theme | null,
    debug: boolean | null,
  ) {
    if (_coreInstance) {
      this.coreInstance = _coreInstance;
    } else if (window.hypernetCoreInstance) {
      this.coreInstance = window.hypernetCoreInstance as IHypernetCore;
    } else {
      throw new Error("core instance is required");
    }

    this.defaultGovernanceChainId = ChainId(defaultGovernanceChainId || 1);
    this.theme = theme;
    // This is to cache web ui instance in window so it may prevent from having multiple web ui instances
    window.hypernetWebUIInstance = HypernetWebUI.instance;

    this.UIData = _UIData;
    this.viewUtils = new ViewUtils();
    this.dateUtils = new DateUtils();
  }

  private _generateDomElement(
    selector: string,
    forceRegenerate?: boolean,
  ): HTMLElement | null {
    if (forceRegenerate) {
      this._removeExistedElement(selector);
    }

    if (document.getElementById(selector) == null) {
      const element = document.createElement("div");
      element.setAttribute("id", selector);
      document.body.appendChild(element);
      document.getElementById(selector);

      return element;
    }
    return document.getElementById(selector);
  }

  private _removeExistedElement(selector: string) {
    const element = document.getElementById(selector);
    if (element) {
      element.remove();
    }
  }

  private _bootstrapComponent(
    component: React.ReactNode,
    withModal = false,
    closeCallback?: () => void,
    modalStyle?: React.CSSProperties,
    hasTheme?: boolean,
    hideLoadingSpinner?: boolean,
    useDarkTheme?: boolean,
  ) {
    if (this.coreInstance == null) {
      throw new Error("core instance is required");
    }

    // Material-Ui v4 has a problem with multiple theme provider in the same react tree level
    // For fixing that issue we need to provide a single top level Theme provider.
    // But we can not do that because of the our widget renderer functions are under control of the customers/our library users
    // We can export a parent top level theme provider and expect that in the integration flow users should use it for wrapping the our rendered widgets.
    // But not gonna work in all situations
    // Also we are using multipe react init point with calling ReactDom.render method. And material ui has some problems with that to.
    // For fixin these issues first we need to provide a seed for our classname generation on the top of the widget renderer function
    // And also that seed should be unique for the same react tree level rendered widgets
    // For making them unique we added widgetUniqueIdentifier as a unique prefix

    const widgetUniqueIdentifier = `hypernetlabs-${uuidv4()}`;

    const Theme = hasTheme ? ThemeProvider : Box;

    const generateClassName = createGenerateClassName({
      seed: widgetUniqueIdentifier,
    });

    const themeObjectArr = [
      { palette: this.theme?.dark, theme: darkTheme },
      { palette: this.theme?.light, theme: lightTheme },
    ];
    const themeIndex = Number(useDarkTheme);

    const selectedTheme = themeObjectArr[themeIndex].theme;
    const customPalette = themeObjectArr[themeIndex].palette;

    const theme = customPalette
      ? injectCustomPaletteToTheme(selectedTheme, customPalette)
      : selectedTheme;

    return (
      <StoreProvider
        coreProxy={this.coreInstance}
        UIData={this.UIData}
        viewUtils={this.viewUtils}
        dateUtils={this.dateUtils}
        widgetUniqueIdentifier={widgetUniqueIdentifier}
        defaultGovernanceChainId={this.defaultGovernanceChainId}
      >
        <StylesProvider generateClassName={generateClassName}>
          <Theme theme={theme}>
            <Provider
              template={AlertTemplate}
              timeout={10000}
              position={positions.BOTTOM_CENTER}
            >
              <LayoutProvider>
                <MainContainer
                  withModal={withModal}
                  closeCallback={closeCallback}
                  modalStyle={modalStyle}
                  isV2={hasTheme}
                  hideLoadingSpinner={hideLoadingSpinner}
                >
                  {component}
                </MainContainer>
              </LayoutProvider>
            </Provider>
          </Theme>
        </StylesProvider>
      </StoreProvider>
    );
  }

  private _getThrowableRender(
    renderReact: () => void,
  ): Result<void, RenderError> {
    const throwable = Result.fromThrowable(renderReact, (err) => {
      return new RenderError("Error in fromThrowable", err);
    });
    return throwable();
  }

  public renderPrivateKeysModal(): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(<PrivateKeysFlow />, true, undefined, {
          zIndex: 99999,
        }),
        this._generateDomElement(PRIVATE_KEYS_FLOW_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderMetamaskWarningModal(): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <MetamaskWarning />,
          true,
          undefined,
          {
            zIndex: 99999,
          },
          true,
        ),
        this._generateDomElement(METAMASK_WARNING_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderWalletConnectWidget(
    config: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <WalletConnectWidget />,
          config.showInModal,
          () => {
            if (this.coreInstance) {
              this.coreInstance.rejectProviderIdRequest();
            }
          },
          {
            zIndex: 99999,
          },
          true,
          config.hideLoadingSpinner,
        ),
        this._generateDomElement(
          config?.selector || CONNECT_WALLET_WIDGET_SELECTOR,
          true,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderChainSelectorWidget(
    config: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <ChainSelectorWidget {...config} />,
          config?.showInModal,
          undefined,
          undefined,
          true,
          config?.hideLoadingSpinner,
        ),
        this._generateDomElement(
          config?.selector || CHAIN_SELECTOR_WIDGET_ID_SELECTOR,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderWarningAlertModal(
    errorMessage?: string,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <WarningAlert errorMessage={errorMessage} />,
          true,
          undefined,
          {
            zIndex: 99999,
          },
        ),
        this._generateDomElement(WARNING_ALERT_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderConnectedAccountWidget(
    config?: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <ConnectedAccountWidget {...config} />,
          config?.showInModal,
          undefined,
          undefined,
          true,
          config?.hideLoadingSpinner,
        ),
        this._generateDomElement(config?.selector || CONNECTED_ACCOUNT_WIDGET),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public payments: IHypernetPaymentsWebUI = {
    renderBalancesWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <BalancesWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
            config?.hideLoadingSpinner,
          ),
          this._generateDomElement(
            config?.selector || BALANCES_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderGatewaysWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <GatewaysWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || BALANCES_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderFundWidget: (config?: IRenderParams): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <FundWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(config?.selector || FUND_WIDGET_ID_SELECTOR),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderWithdrawWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <WithdrawWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || WITHDRAW_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderLinksWidget: (config?: IRenderParams): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <LinksWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || LINKS_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderPublicIdentifierWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <PublicIdentifierWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || PUBLIC_IDENTIFIER_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderStateChannelsWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <StateChannelsWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || STATE_CHANNELS_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderConnectorAuthorizationFlow: (
      config: IConnectorAuthorizationFlowParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <ConnectorAuthorizationFlow
              connectorUrl={config.connectorUrl}
              connectorName={config.connectorName}
              connectorLogoUrl={config.connectorLogoUrl}
            />,
            config.showInModal,
          ),
          this._generateDomElement(
            config?.selector || CONNECTOR_AUTHORIZATION_FLOW_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    startOnboardingFlow: (
      config: IOnboardingFlowParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <OnboardingFlow
              gatewayUrl={config.gatewayUrl}
              gatewayName={config.gatewayName}
              gatewayLogoUrl={config.gatewayLogoUrl}
              finalSuccessContent={config.finalSuccessContent}
              closeCallback={config.closeCallback}
              excludeCardWrapper={config.excludeCardWrapper}
              launchpadUrl={config.launchpadUrl}
              renderGatewayApprovalContent={
                config?.renderGatewayApprovalContent
              }
            />,
            config.showInModal,
            config.closeCallback,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || ONBOARDING_FLOW_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderBalancesSummaryWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <BalancesSummaryWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || BALANCES_SUMMARY_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderPaymentWidget: (
      config?: IRenderPaymentWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <PaymentWidget
              counterPartyAccount={config?.counterPartyAccount}
              amount={config?.amount}
              expirationDate={config?.expirationDate}
              requiredStake={config?.requiredStake}
              paymentTokenAddress={config?.paymentTokenAddress}
              gatewayUrl={config?.gatewayUrl}
              paymentType={config?.paymentType}
            />,
            config?.showInModal,
          ),
          this._generateDomElement(
            config?.selector || PAYMENT_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },
  };

  public governance: IHypernetGovernanceWebUI = {
    renderProposalsWidget: (
      config?: IProposalsWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <ProposalsWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || PROPOSALS_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderProposalDetailWidget: (
      config: IProposalDetailWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <ProposalDetailWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || PROPOSALS_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderProposalCreateWidget: (
      config?: IProposalCreateWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <CreateProposalWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || PROPOSAL_CREATE_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderHypertokenBalanceWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <HypertokenBalanceWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
            config?.hideLoadingSpinner,
          ),
          this._generateDomElement(
            config?.selector || HYPERTOKEN_BALANCE_WIDGET,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderVotingPowerWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <VotingPowerWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
            config?.hideLoadingSpinner,
          ),
          this._generateDomElement(config?.selector || VOTING_POWER_WIDGET),
        );
      };
      return this._getThrowableRender(renderReact);
    },
  };

  public registries: IHypernetRegistriesWebUI = {
    renderRegistryListWidget: (
      config?: IRegistryListWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <RegistryListWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || REGISTRY_LIST_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderRegistryDetailWidget: (
      config: IRegistryDetailWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <RegistryDetailWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || REGISTRY_LIST_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderRegistryEntryListWidget: (
      config: IRegistryEntryListWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <RegistryEntryListWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || REGISTRY_ENTRY_LIST_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderRegistryEntryDetailWidget: (
      config: IRegistryEntryDetailWidgetParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <RegistryEntryDetailWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector || REGISTRY_ENTRY_DETAIL_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },

    renderRegistryLazyMintingRequestsWidget: (
      config?: IRenderParams,
    ): Result<void, RenderError> => {
      const renderReact = () => {
        return ReactDOM.render(
          this._bootstrapComponent(
            <RegistryLazyMintingRequestsWidget {...config} />,
            config?.showInModal,
            undefined,
            undefined,
            true,
          ),
          this._generateDomElement(
            config?.selector ||
              REGISTRY_LAZY_MINTING_REQUESTS_WIDGET_ID_SELECTOR,
          ),
        );
      };
      return this._getThrowableRender(renderReact);
    },
  };
}

declare let window: any;

window.HypernetWebUI = HypernetWebUI;
