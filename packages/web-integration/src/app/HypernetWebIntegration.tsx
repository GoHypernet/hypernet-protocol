import * as React from "react";
import * as ReactDOM from "react-dom";

import { TransactionList } from "@hypernetlabs/web-ui";
import MainContainer from "../containers/MainContainer";
import BalancesWidget from "../widgets/BalancesWidget";
import { IHypernetWebIntegration } from "./HypernetWebIntegration.interface";
import { StoreProvider } from "../contexts";
import { TRANSACTION_LIST_ID_SELECTOR, BALANCES_WIDGET_ID_SELECTOR } from "../constants";
import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";
import HypernetIFrameProxy from "../proxy/HypernetIFrameProxy";
import { Balances } from "@hypernetlabs/hypernet-core";
import { AssetBalanceParams, AssetBalanceViewModel } from "../viewModel";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  protected iframeURL: string = "http://localhost:8090";
  protected proxy: IHypernetIFrameProxy;
  protected iframeContainer: HTMLElement;
  private static instance: IHypernetWebIntegration;

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
    this.proxy = new HypernetIFrameProxy(this.iframeContainer, this.iframeURL);

    // wait for the core to be intialized
    this.ready = new Promise((resolve, reject) => {
      this.proxy.proxyReady().then(() => {
        this.proxy
          .getEthereumAccounts()
          .andThen((accounts: any) => this.proxy.initialize(accounts[0]))
          .match(
            () => {
              resolve();
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

  public ready: Promise<void>;

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

  private async bootstrapComponent(component: React.ReactNode) {
    const ss = await this.getBlances();
    console.log("ss: ", ss);
    return (
      <StoreProvider
        initialData={{
          balances: ss,
        }}
      >
        <MainContainer>{component}</MainContainer>
      </StoreProvider>
    );
  }

  public getBlances(): Promise<AssetBalanceViewModel[]> {
    return new Promise((resolve, reject) => {
      this.proxy.getBalances().map((balance: Balances) => {
        resolve(
          balance.assets.reduce((acc: AssetBalanceViewModel[], assetBalance) => {
            acc.push(new AssetBalanceViewModel(new AssetBalanceParams(assetBalance)));
            return acc;
          }, []),
        );
      });
    });
  }

  public async renderBalances(selector: string = BALANCES_WIDGET_ID_SELECTOR) {
    ReactDOM.render(await this.bootstrapComponent(<BalancesWidget />), this.generateDomElement(selector));
  }

  public async renderTransactionList(selector: string = TRANSACTION_LIST_ID_SELECTOR) {
    ReactDOM.render(await this.bootstrapComponent(<TransactionList />), this.generateDomElement(selector));
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
