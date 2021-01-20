import React from "react";
import ReactDOM from "react-dom";

import { TransactionList } from "@hypernetlabs/web-ui";
import MainContainer from "../containers/MainContainer";
import Authentication from "../screens/Authentication";
import { IHypernetWebIntegration } from "./HypernetWebIntegration.interface";
import { StoreProvider } from "../contexts";
import { MAIN_CONTANER_ID_SELECTOR, TRANSACTION_LIST_ID_SELECTOR } from "../constants";
import IHypernetIFrameProxy from "../proxy/IHypernetIFrameProxy";
import HypernetIFrameProxy from "../proxy/HypernetIFrameProxy";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  protected iframe: HTMLIFrameElement;
  protected iframeURL: string = "some_url";
  //protected proxy: IHypernetIFrameProxy;

  protected constructor(iframeURL?: string) {
    // Initialize hypernet invisible iframe

    // Create an iframe
    this.iframeURL = iframeURL || this.iframeURL;
    this.iframe = document.createElement("iframe");
    this.iframe.id = "__hypernet-protocol-iframe__";
    this.iframe.src = this.iframeURL;
    this.iframe.width = "0px";
    this.iframe.height = "0px";
    this.iframe.tabIndex = -1;
    this.iframe.setAttribute("style", "position: absolute; border: 0; border: none;");

    // Attach it to the body
    document.body.appendChild(this.iframe);

    // Create a proxy connection to the iframe
    //this.proxy = new HypernetIFrameProxy(this.iframe.id);
  }
  private static instance: IHypernetWebIntegration;

  // This class must be used as a singleton, this enforces that restriction.
  public static getInstance(): IHypernetWebIntegration {
    if (HypernetWebIntegration.instance == null) {
      HypernetWebIntegration.instance = new HypernetWebIntegration();
    }

    return HypernetWebIntegration.instance;
  }

  private generateDomElement(selector: string) {
    this.removeExitedElement(selector);

    const element = document.createElement("div");
    element.setAttribute("id", selector);
    document.body.appendChild(element);
    document.getElementById(selector);

    return element;
  }

  private removeExitedElement(selector: string) {
    const element = document.getElementById(selector);
    if (element) {
      element.remove();
    }
  }

  private bootstrapComponent(component: React.ReactNode) {
    return (
      <StoreProvider
        initialData={{
          hypernetProtocol: { anything: "anything asdsad" },
          ethAddress: "ethAdress ggggg",
        }}
      >
        <MainContainer>{component}</MainContainer>
      </StoreProvider>
    );
  }

  public renderAuthentication(selector: string = MAIN_CONTANER_ID_SELECTOR) {
    ReactDOM.render(this.bootstrapComponent(<Authentication />), this.generateDomElement(selector));
  }

  public renderTransactionList(selector: string = TRANSACTION_LIST_ID_SELECTOR) {
    ReactDOM.render(this.bootstrapComponent(<TransactionList />), this.generateDomElement(selector));
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
