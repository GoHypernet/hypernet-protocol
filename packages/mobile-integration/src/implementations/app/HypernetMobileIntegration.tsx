import { IHypernetCore } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

export enum ECoreViewDataKeys {
  accounts = "accounts",
  balances = "balances",
  links = "links",
  activeLinks = "activeLinks",
  authorizedGateways = "authorizedGateways",
}

export default class HypernetMobileIntegration {
  private webIntegrationInstance: IHypernetWebIntegration;
  public coreProxy: IHypernetCore = {} as IHypernetCore;

  constructor() {
    this.webIntegrationInstance = new HypernetWebIntegration(
      null,
      null,
      true,
      false,
      null,
    );
    this.webIntegrationInstance.getReady().map((coreProxy) => {
      this.coreProxy = coreProxy;
      if (window.ReactNativeWebView) {
        this.postAccounts();
        this.postBalances();
        this.postLinks();
        this.postActiveLinks();
        this.postAuthorizedGateways();
      }

      coreProxy.onBalancesChanged.subscribe(() => {
        this.postBalances();
      });
      coreProxy.onPullPaymentReceived.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPullPaymentSent.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPullPaymentUpdated.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPushPaymentReceived.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPushPaymentSent.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPushPaymentUpdated.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPushPaymentDelayed.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPullPaymentDelayed.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onGatewayAuthorized.subscribe(() => {
        this.postAuthorizedGateways();
      });
    });
  }

  private postAccounts() {
    this.coreProxy.getEthereumAccounts().map((accounts) => {
      this.postDataToRN(ECoreViewDataKeys.accounts, accounts);
    });
  }

  private postBalances() {
    this.coreProxy.payments.getBalances().map((balances) => {
      this.postDataToRN(ECoreViewDataKeys.balances, balances);
    });
  }

  private postLinks() {
    this.coreProxy.payments.getLinks().map((links) => {
      this.postDataToRN(ECoreViewDataKeys.links, links);
    });
  }

  private postActiveLinks() {
    this.coreProxy.payments.getActiveLinks().map((links) => {
      this.postDataToRN(ECoreViewDataKeys.activeLinks, links);
    });
  }

  private postAuthorizedGateways() {
    this.coreProxy.payments.getAuthorizedGateways().map((gateways) => {
      //const gatewayList = [...gateways].map(([name, value]) => ({ name, value }));
      this.postDataToRN(ECoreViewDataKeys.authorizedGateways, gateways);
    });
  }

  private postDataToRN(dataKey: string, data: any) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        keyName: dataKey,
        keyValue: data,
      }),
    );
  }
}
