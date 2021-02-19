import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

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
  authorizedMerchants = "authorizedMerchants",
}

export default class HypernetMobileIntegration {
  private webIntegrationInstance: IHypernetWebIntegration;
  public coreProxy: IHypernetIFrameProxy = {} as IHypernetIFrameProxy;

  constructor() {
    this.webIntegrationInstance = new HypernetWebIntegration();
    this.webIntegrationInstance.getReady().map((coreProxy) => {
      this.coreProxy = coreProxy;
      if (window.ReactNativeWebView) {
        this.postAccounts();
        this.postBalances();
        this.postLinks();
        this.postActiveLinks();
        this.postAuthorizedMerchants();
      }

      coreProxy.onBalancesChanged.subscribe(() => {
        this.postBalances();
      });
      coreProxy.onPullPaymentApproved.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPullPaymentProposed.subscribe(() => {
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
      coreProxy.onPushPaymentProposed.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onPushPaymentUpdated.subscribe(() => {
        this.postLinks();
        this.postActiveLinks();
      });
      coreProxy.onMerchantAuthorized.subscribe(() => {
        this.postAuthorizedMerchants();
      });
    });
  }

  private postAccounts() {
    this.coreProxy.getEthereumAccounts().map((accounts) => {
      this.postDataToRN(ECoreViewDataKeys.accounts, accounts);
    });
  }

  private postBalances() {
    this.coreProxy.getBalances().map((balances) => {
      this.postDataToRN(ECoreViewDataKeys.balances, balances);
    });
  }

  private postLinks() {
    this.coreProxy.getLinks().map((links) => {
      this.postDataToRN(ECoreViewDataKeys.links, links);
    });
  }

  private postActiveLinks() {
    this.coreProxy.getActiveLinks().map((links) => {
      this.postDataToRN(ECoreViewDataKeys.activeLinks, links);
    });
  }

  private postAuthorizedMerchants() {
    this.coreProxy.getAuthorizedMerchants().map((merchants) => {
      //const merchantList = [...merchants].map(([name, value]) => ({ name, value }));
      this.postDataToRN(ECoreViewDataKeys.authorizedMerchants, merchants);
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
