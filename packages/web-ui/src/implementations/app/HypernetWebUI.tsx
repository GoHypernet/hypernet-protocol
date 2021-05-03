import { IHypernetCore, MerchantUrl, RenderError } from "@hypernetlabs/objects";
import { Result } from "neverthrow";
import React from "react";
import ReactDOM from "react-dom";

import {
  BALANCES_WIDGET_ID_SELECTOR,
  FUND_WIDGET_ID_SELECTOR,
  LINKS_WIDGET_ID_SELECTOR,
  PAYMENT_WIDGET_ID_SELECTOR,
  PRIVATE_KEYS_FLOW_ID_SELECTOR,
  CONNECTOR_AUTHORIZATION_FLOW,
} from "@web-ui/constants";
import { MainContainer } from "@web-ui/containers/MainContainer";
import { LayoutProvider, StoreProvider } from "@web-ui/contexts";
import ConnectorAuthorizationFlow from "@web-ui/flows/ConnectorAuthorizationFlow";
import PrivateKeysFlow from "@web-ui/flows/PrivateKeysFlow";
import {
  IConnectorAuthorizationFlowParams,
  IHypernetWebUI,
  IRenderParams,
  IRenderPaymentWidgetParams,
} from "@web-ui/interfaces/app/IHypernetWebUI";
import BalancesWidget from "@web-ui/widgets/BalancesWidget";
import FundWidget from "@web-ui/widgets/FundWidget";
import LinksWidget from "@web-ui/widgets/LinksWidget";
import { PaymentWidget } from "@web-ui/widgets/PaymentWidget";

export default class HypernetWebUI implements IHypernetWebUI {
  private static instance: IHypernetWebUI;
  protected coreInstance: IHypernetCore;
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
  }

  private _generateDomElement(selector: string) {
    this._removeExistedElement(selector);

    const element = document.createElement("div");
    element.setAttribute("id", selector);
    document.body.appendChild(element);
    document.getElementById(selector);

    return element;
  }

  private _removeExistedElement(selector: string) {
    const element = document.getElementById(selector);
    if (element) {
      element.remove();
    }
  }

  private _bootstrapComponent(component: React.ReactNode, withModal = false) {
    if (this.coreInstance == null) {
      throw new Error("core instance is required");
    }
    return (
      <StoreProvider proxy={this.coreInstance}>
        <LayoutProvider>
          <MainContainer withModal={withModal}>{component}</MainContainer>
        </LayoutProvider>
      </StoreProvider>
    );
  }

  private _getThrowableRender(renderReact: () => void): Result<void, any> {
    const throwable = Result.fromThrowable(renderReact, (err) => {
      return err as RenderError;
    });
    return throwable();
  }

  public renderPrivateKeysModal(): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(<PrivateKeysFlow />, true),
        this._generateDomElement(PRIVATE_KEYS_FLOW_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderBalancesWidget(
    config?: IRenderParams,
  ): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(<BalancesWidget />, config?.showInModal),
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
        this._bootstrapComponent(<FundWidget />, config?.showInModal),
        this._generateDomElement(config?.selector || FUND_WIDGET_ID_SELECTOR),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public renderLinksWidget(config?: IRenderParams): Result<void, RenderError> {
    const renderReact = () => {
      return ReactDOM.render(
        this._bootstrapComponent(<LinksWidget />, config?.showInModal),
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
          config?.selector || CONNECTOR_AUTHORIZATION_FLOW,
        ),
      );
    };
    return this._getThrowableRender(renderReact);
  }

  public displayMerchantIFrame(merchantUrl: MerchantUrl): void {
    this.coreInstance?.displayMerchantIFrame(merchantUrl);
  }

  public closeMerchantIFrame(merchantUrl: MerchantUrl): void {
    this.coreInstance?.closeMerchantIFrame(merchantUrl);
  }
}

declare let window: any;

window.HypernetWebUI = HypernetWebUI;