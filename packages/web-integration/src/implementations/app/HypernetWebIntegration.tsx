import React from "react";
import ReactDOM from "react-dom";
import { ResultAsync } from "@hypernetlabs/hypernet-core";

import MainContainer from "@web-integration/containers/MainContainer";
import BalancesWidget from "@web-integration/widgets/BalancesWidget";
import LinksWidget from "@web-integration/widgets/LinksWidget";
import PaymentWidget from "@web-integration/widgets/PaymentWidget";
import FundWidget from "@web-integration/widgets/FundWidget";
import {
  IConnectorAuthorizationFlowParams,
  IHypernetWebIntegration,
  IRenderParams,
  IRenderPaymentWidgetParams,
} from "@web-integration/interfaces/app/IHypernetWebIntegration";
import { LayoutProvider, StoreProvider } from "@web-integration/contexts";
import {
  BALANCES_WIDGET_ID_SELECTOR,
  FUND_WIDGET_ID_SELECTOR,
  LINKS_WIDGET_ID_SELECTOR,
  PAYMENT_WIDGET_ID_SELECTOR,
} from "@web-integration/constants";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";
import HypernetIFrameProxy from "@web-integration/implementations/proxy/HypernetIFrameProxy";
import ConnectorAuthorizationFlow from "@web-integration/flows/ConnectorAuthorizationFlow";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;

  protected iframeURL: string = "http://localhost:8090";
  protected iframeContainer: HTMLElement;

  public core: IHypernetIFrameProxy;

  constructor(iframeURL?: string) {
    this.iframeURL = iframeURL || this.iframeURL;

    // Create a container element for the iframe proxy
    this.iframeContainer = document.createElement("div");
    this.iframeContainer.id = "__hypernet-protocol-iframe-container__";
    this.iframeContainer.tabIndex = -1;
    this.iframeContainer.setAttribute("style", "display: none;");

    // Attach it to the body
    document.body.appendChild(this.iframeContainer);

    // Create a proxy connection to the iframe
    this.core = new HypernetIFrameProxy(this.iframeContainer, this.iframeURL);
  }

  // wait for the core to be intialized
  protected getReadyResult: ResultAsync<IHypernetIFrameProxy, Error> | undefined;
  public getReady(): ResultAsync<IHypernetIFrameProxy, Error> {
    if (this.getReadyResult != null) {
      return this.getReadyResult;
    }
    this.getReadyResult = this.core
      .activate()
      .andThen(() => {
        return this.core.activate();
      })
      .andThen(() => {
        return this.core.getEthereumAccounts();
      })
      .andThen((accounts: any) => this.core.initialize(accounts[0]))
      .map(() => this.core);

    return this.getReadyResult;
  }

  // This class must be used as a singleton, this enforces that restriction.
  public static getInstance(): IHypernetWebIntegration {
    if (HypernetWebIntegration.instance == null) {
      HypernetWebIntegration.instance = new HypernetWebIntegration();
    }

    return HypernetWebIntegration.instance;
  }

  private generateDomElement(selector: string) {
    this.removeExistedElement(selector);

    const element = document.createElement("div");
    element.setAttribute("id", selector);
    document.body.appendChild(element);
    document.getElementById(selector);

    return element;
  }

  private removeExistedElement(selector: string) {
    const element = document.getElementById(selector);
    if (element) {
      element.remove();
    }
  }

  private async bootstrapComponent(component: React.ReactNode, withModal: boolean = false) {
    return (
      <StoreProvider proxy={this.core}>
        <LayoutProvider>
          <MainContainer withModal={withModal}>{component}</MainContainer>
        </LayoutProvider>
      </StoreProvider>
    );
  }

  public async renderBalancesWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this.bootstrapComponent(<BalancesWidget />),
      this.generateDomElement(config?.selector || BALANCES_WIDGET_ID_SELECTOR),
    );
  }

  public async renderFundWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this.bootstrapComponent(<FundWidget />),
      this.generateDomElement(config?.selector || FUND_WIDGET_ID_SELECTOR),
    );
  }

  public async renderLinksWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this.bootstrapComponent(<LinksWidget />),
      this.generateDomElement(config?.selector || LINKS_WIDGET_ID_SELECTOR),
    );
  }

  public async renderPaymentWidget(config?: IRenderPaymentWidgetParams) {
    ReactDOM.render(
      await this.bootstrapComponent(
        <PaymentWidget
          counterPartyAccount={config?.counterPartyAccount}
          amount={config?.amount}
          expirationDate={config?.expirationDate}
          requiredStake={config?.requiredStake}
          paymentTokenAddress={config?.paymentTokenAddress}
          merchantUrl={config?.merchantUrl}
          paymentType={config?.paymentType}
        />,
        true,
      ),
      this.generateDomElement(config?.selector || PAYMENT_WIDGET_ID_SELECTOR),
    );
  }

  public async renderConnectorAuthorizationFlow(config: IConnectorAuthorizationFlowParams) {
    ReactDOM.render(
      await this.bootstrapComponent(
        <ConnectorAuthorizationFlow
          connectorUrl={config.connectorUrl}
          connectorName={config.connectorName}
          connectorLogoUrl={config.connectorLogoUrl}
        />,
        config.showInModal,
      ),
      this.generateDomElement(config?.selector || BALANCES_WIDGET_ID_SELECTOR),
    );
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
