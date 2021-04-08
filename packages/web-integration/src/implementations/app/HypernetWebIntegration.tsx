import React from "react";
import ReactDOM from "react-dom";
import { ResultAsync } from "neverthrow";

import MainContainer from "@web-integration-containers/MainContainer";
import BalancesWidget from "@web-integration-widgets/BalancesWidget";
import LinksWidget from "@web-integration-widgets/LinksWidget";
import PaymentWidget from "@web-integration-widgets/PaymentWidget";
import FundWidget from "@web-integration-widgets/FundWidget";
import {
  IConnectorAuthorizationFlowParams,
  IHypernetWebIntegration,
  IRenderParams,
  IRenderPaymentWidgetParams,
} from "@web-integration-interfaces/app/IHypernetWebIntegration";
import { LayoutProvider, StoreProvider } from "@web-integration-contexts";
import {
  BALANCES_WIDGET_ID_SELECTOR,
  FUND_WIDGET_ID_SELECTOR,
  LINKS_WIDGET_ID_SELECTOR,
  PAYMENT_WIDGET_ID_SELECTOR,
  PRIVATE_KEYS_FLOW_ID_SELECTOR,
} from "@web-integration-constants";
import IHypernetIFrameProxy from "@web-integration-interfaces/proxy/IHypernetIFrameProxy";
import HypernetIFrameProxy from "@web-integration-implementations/proxy/HypernetIFrameProxy";
import ConnectorAuthorizationFlow from "@web-integration-flows/ConnectorAuthorizationFlow";
import PrivateKeysFlow from "@web-integration-flows/PrivateKeysFlow";
import { ThemeProvider } from "theming";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;

  protected iframeURL: string = "http://localhost:8090";
  protected currentMerchantUrl: string | undefined | null;

  public core: IHypernetIFrameProxy;

  constructor(iframeURL?: string) {
    this.iframeURL = iframeURL || this.iframeURL;

    // Create a proxy connection to the iframe
    this.core = new HypernetIFrameProxy(this._prepareIFrameContainer(), this.iframeURL, "hypernet-core-iframe");

    this.core.onMerchantIFrameDisplayRequested.subscribe((merchantUrl) => {
      this.currentMerchantUrl = merchantUrl;
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      console.log("Core requested private credintials...234");
      this._renderPrivateKeysModal();
    });

    /* setTimeout(() => {
      console.log("starttt send keyss222");
      this.core.providePrivateCredentials({
        mnemonic: "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
      });
    }, 15000); */
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

  private _bootstrapComponent(component: React.ReactNode, withModal: boolean = false) {
    return (
      <StoreProvider proxy={this.core}>
        <LayoutProvider>
          <MainContainer withModal={withModal}>{component}</MainContainer>
        </LayoutProvider>
      </StoreProvider>
    );
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "__hypernet-protocol-iframe-container__";

    // Add close modal icon to iframe container
    const closeButton = document.createElement("div");
    closeButton.id = "__hypernet-protocol-iframe-close-icon__";
    //@ts-ignore
    closeButton.innerHTML = `
      <img src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png" width="20" />
    `;
    iframeContainer.appendChild(closeButton);

    closeButton.addEventListener(
      "click",
      (e) => {
        // TODO: Figure out how to track which merchant we are showing
        if (this.currentMerchantUrl != null) {
          this.core.closeMerchantIFrame(this.currentMerchantUrl);
          this.currentMerchantUrl = null;
        }
      },
      false,
    );

    // Add iframe modal style
    // TODO: Close button style is not responsive with the content height, need to be fixed.
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
        iframe {
          position: absolute;
          display: none;
          border: none;
          width: 700px;
          height: 800px;
          min-height: 200px;
          background-color: white;
          top: 50%;
          left: 50%;
          box-shadow: 0px 4px 20px #000000;
          border-radius: 4px;
          transform: translate(-50%, -50%);
          padding: 15px;
        }
        #__hypernet-protocol-iframe-container__ {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.6);
        }
        #__hypernet-protocol-iframe-close-icon__ {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + 335px), calc(-50% - 385px));
          z-index: 2;
          cursor: pointer;
        }
    `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    return iframeContainer;
  }

  public async renderBalancesWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this._bootstrapComponent(<BalancesWidget />),
      this._generateDomElement(config?.selector || BALANCES_WIDGET_ID_SELECTOR),
    );
  }

  public async renderFundWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this._bootstrapComponent(<FundWidget />),
      this._generateDomElement(config?.selector || FUND_WIDGET_ID_SELECTOR),
    );
  }

  public async renderLinksWidget(config?: IRenderParams) {
    ReactDOM.render(
      await this._bootstrapComponent(<LinksWidget />),
      this._generateDomElement(config?.selector || LINKS_WIDGET_ID_SELECTOR),
    );
  }

  public async renderPaymentWidget(config?: IRenderPaymentWidgetParams) {
    ReactDOM.render(
      await this._bootstrapComponent(
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
      this._generateDomElement(config?.selector || PAYMENT_WIDGET_ID_SELECTOR),
    );
  }

  public async renderConnectorAuthorizationFlow(config: IConnectorAuthorizationFlowParams) {
    ReactDOM.render(
      await this._bootstrapComponent(
        <ConnectorAuthorizationFlow
          connectorUrl={config.connectorUrl}
          connectorName={config.connectorName}
          connectorLogoUrl={config.connectorLogoUrl}
        />,
        config.showInModal,
      ),
      this._generateDomElement(config?.selector || BALANCES_WIDGET_ID_SELECTOR),
    );
  }

  private _renderPrivateKeysModal() {
    ReactDOM.render(
      this._bootstrapComponent(<PrivateKeysFlow />, true),
      this._generateDomElement(PRIVATE_KEYS_FLOW_ID_SELECTOR),
    );
  }

  public displayMerchantIFrame(merchantUrl: string): void {
    this.core.displayMerchantIFrame(merchantUrl);
  }

  public closeMerchantIFrame(merchantUrl: string): void {
    this.core.closeMerchantIFrame(merchantUrl);
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
