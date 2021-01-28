import React from "react";
import ReactDOM from "react-dom";

import MainContainer from "../containers/MainContainer";
import BalancesWidget from "../widgets/BalancesWidget";
import LinksWidget from "../widgets/LinksWidget";
import PaymentWidget from "../widgets/PaymentWidget";
import {
  IConnectorRenderParams,
  IHypernetWebIntegration,
  IRenderParams,
  IRenderPaymentWidgetParams,
} from "./HypernetWebIntegration.interface";
import { StoreProvider } from "../contexts";
import {
  BALANCES_WIDGET_ID_SELECTOR,
  FUND_WIDGET_ID_SELECTOR,
  LINKS_WIDGET_ID_SELECTOR,
  PAYMENT_WIDGET_ID_SELECTOR,
} from "../constants";
import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";
import HypernetIFrameProxy from "../proxy/HypernetIFrameProxy";
import FundWidget from "../widgets/FundWidget";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;

  protected iframeURL: string = "http://localhost:8090";
  protected iframeContainer: HTMLElement;

  public proxy: IHypernetIFrameProxy;

  constructor(iframeURL?: string) {
    this.iframeURL = iframeURL || this.iframeURL;

    // Create a container element for the iframe proxy
    this.iframeContainer = document.createElement("div");
    this.iframeContainer.id = "__hypernet-protocol-iframe-container__";
    this.iframeContainer.tabIndex = -1;
    // TODO: add window popup like style and set it to display block whenever we want to show the iframe popup,
    this.iframeContainer.setAttribute("style", "display: none;");

    // Attach it to the body
    document.body.appendChild(this.iframeContainer);

    // Create a proxy connection to the iframe
    this.proxy = new HypernetIFrameProxy(this.iframeContainer, this.iframeURL);
  }

  // wait for the core to be intialized
  public getReady(): Promise<IHypernetIFrameProxy> {
    return new Promise((resolve, reject) => {
      this.proxy.proxyReady().then(() => {
        this.proxy
          .getEthereumAccounts()
          .andThen((accounts: any) => this.proxy.initialize(accounts[0]))
          .match(
            () => {
              resolve(this.proxy);
            },
            (err: any) => {
              // handle error
              console.log("err", err);
              reject(err);
            },
          );
      });
    });
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
      <StoreProvider proxy={this.proxy}>
        <MainContainer withModal={withModal}>{component}</MainContainer>
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
          disputeMediator={config?.disputeMediator}
          paymentType={config?.paymentType}
        />,
        true,
      ),
      this.generateDomElement(config?.selector || PAYMENT_WIDGET_ID_SELECTOR),
    );
  }

  public async startConnectorFlow(config?: IConnectorRenderParams) {
    this.iframeContainer.setAttribute("style", "display: block;");
    this.proxy.startConnectorFlow(config?.connector);
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
