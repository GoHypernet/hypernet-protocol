import { IHypernetCore, GatewayUrl, RenderError } from "@hypernetlabs/objects";
import MainContainer from "@web-ui/containers/MainContainer";
import { LayoutProvider, StoreProvider } from "@web-ui/contexts";
import {
  IConnectorAuthorizationFlowParams,
  IHypernetWebUI,
  IRenderParams,
  IRenderPaymentWidgetParams,
  IOnboardingFlowParams,
  IViewUtils,
  IDateUtils,
} from "@web-ui/interfaces";
import { Result } from "neverthrow";
import React from "react";
import ReactDOM from "react-dom";

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
} from "@web-ui/constants";
import ConnectorAuthorizationFlow from "@web-ui/flows/ConnectorAuthorizationFlow";
import OnboardingFlow from "@web-ui/flows/OnboardingFlow";
import PrivateKeysFlow from "@web-ui/flows/PrivateKeysFlow";
import { ViewUtils, DateUtils } from "@web-ui/utils";
import BalancesWidget from "@web-ui/widgets/BalancesWidget";
import FundWidget from "@web-ui/widgets/FundWidget";
import LinksWidget from "@web-ui/widgets/LinksWidget";
import PublicIdentifierWidget from "@web-ui/widgets/PublicIdentifierWidget";
import MerchantsWidget from "@web-ui/widgets/MerchantsWidget";
import { MetamaskWarning, WarningAlert } from "@web-ui/components";
import { PaymentWidget } from "@web-ui/widgets/PaymentWidget";

export default class HypernetWebUI implements IHypernetWebUI {
  private static instance: IHypernetWebUI;
  protected coreInstance: IHypernetCore;
  protected viewUtils: IViewUtils;
  protected dateUtils: IDateUtils;
  constructor(_coreInstance?: IHypernetCore) {
    if (_coreInstance) {
      this.coreInstance = _coreInstance;
    } else if (window.hypernetCoreInstance) {
      this.coreInstance = window.hypernetCoreInstance as IHypernetCore;
    } else {
      throw new Error("core instance is required");
    }

    // This is to cache web ui instance in window so it may prevent from having multiple web ui instances
    window.hypernetWebUIInstance = HypernetWebUI.instance;

    this.viewUtils = new ViewUtils();
    this.dateUtils = new DateUtils();
  }

  private _generateDomElement(selector: string): HTMLElement | null {
    if (document.getElementById(selector) == null) {
      this._removeExistedElement(selector);

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
  ) {
    if (this.coreInstance == null) {
      throw new Error("core instance is required");
    }
    return (
      <StoreProvider
        coreProxy={this.coreInstance}
        viewUtils={this.viewUtils}
        dateUtils={this.dateUtils}
      >
        <LayoutProvider>
          <MainContainer
            withModal={withModal}
            closeCallback={closeCallback}
            modalStyle={modalStyle}
          >
            {component}
          </MainContainer>
        </LayoutProvider>
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
        this._bootstrapComponent(<MetamaskWarning />, true, undefined, {
          zIndex: 99999,
        }),
        this._generateDomElement(METAMASK_WARNING_ID_SELECTOR),
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

  public renderBalancesWidget(
    config?: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <BalancesWidget {...config} />,
          config?.showInModal,
        ),
        this._generateDomElement(
          config?.selector || BALANCES_WIDGET_ID_SELECTOR,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderMerchantsWidget(
    config?: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <MerchantsWidget {...config} />,
          config?.showInModal,
        ),
        this._generateDomElement(
          config?.selector || BALANCES_WIDGET_ID_SELECTOR,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderFundWidget(config?: IRenderParams): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <FundWidget {...config} />,
          config?.showInModal,
        ),
        this._generateDomElement(config?.selector || FUND_WIDGET_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderLinksWidget(config?: IRenderParams): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <LinksWidget {...config} />,
          config?.showInModal,
        ),
        this._generateDomElement(config?.selector || LINKS_WIDGET_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderPaymentWidget(
    config?: IRenderPaymentWidgetParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <PaymentWidget
            counterPartyAccount={config?.counterPartyAccount}
            amount={config?.amount}
            expirationDate={config?.expirationDate}
            requiredStake={config?.requiredStake}
            paymentTokenAddress={config?.paymentTokenAddress}
            merchantUrl={config?.merchantUrl}
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
  }

  public renderPublicIdentifierWidget(
    config?: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <PublicIdentifierWidget {...config} />,
          config?.showInModal,
        ),
        this._generateDomElement(
          config?.selector || PUBLIC_IDENTIFIER_WIDGET_ID_SELECTOR,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderConnectorAuthorizationFlow(
    config: IConnectorAuthorizationFlowParams,
  ): Result<void, RenderError> {
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
  }

  public startOnboardingFlow(
    config: IOnboardingFlowParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(
          <OnboardingFlow
            merchantUrl={config.merchantUrl}
            merchantName={config.merchantName}
            merchantLogoUrl={config.merchantLogoUrl}
            finalSuccessContent={config.finalSuccessContent}
            closeCallback={config.closeCallback}
          />,
          config.showInModal,
          config.closeCallback,
        ),
        this._generateDomElement(
          config?.selector || ONBOARDING_FLOW_ID_SELECTOR,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }
}

declare let window: any;

window.HypernetWebUI = HypernetWebUI;
