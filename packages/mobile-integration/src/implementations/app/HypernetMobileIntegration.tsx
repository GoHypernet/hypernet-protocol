import { IHypernetMobileIntegration } from "@mobile-integration/interfaces/app/IHypernetMobileIntegration";
import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import { stringify } from "flatted";

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

export default class HypernetMobileIntegration implements IHypernetMobileIntegration {
  private webIntegrationInstance: IHypernetWebIntegration;

  constructor() {
    this.webIntegrationInstance = new HypernetWebIntegration();
  }

  // wait for the core to be intialized
  public getCoreReadyForWebView(): Promise<IHypernetCore> {
    return new Promise((resolve) => {
      this.webIntegrationInstance.getReady().then((coreProxy) => {
        this.postCoreInstanceToReactNativeWebView(coreProxy);
        resolve(coreProxy);
      });
    });
  }

  private postCoreInstanceToReactNativeWebView(coreInstance: IHypernetCore) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(stringify(coreInstance));
    }
  }
}
