import { IHypernetMobileIntegration } from "@mobile-integration/interfaces/app/IHypernetMobileIntegration";
import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";

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
    // TODO: remove this line when provider part is solved.
    this.postCoreInstanceToReactNativeWebView(this.webIntegrationInstance.proxy);

    return new Promise((resolve) => {
      this.webIntegrationInstance.getReady().then(async (coreProxy) => {
        this.postCoreInstanceToReactNativeWebView(coreProxy);
        resolve(coreProxy);
      });
    });
  }

  private postCoreInstanceToReactNativeWebView(coreInstance: IHypernetCore) {
    // TODO: we may need to serilize coreInstance in s different way to get the prototype methods stringified as well.
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(coreInstance));
    }
  }
}
