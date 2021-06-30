import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./AuthorizedGateways.template.html";

export class AuthorizedGatewaysParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

export class MerchantStatus {
  constructor(public merchantUrl: GatewayUrl, public status: boolean) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewaysViewModel {
  public authorizedGateways: ko.ObservableArray<MerchantStatus>;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedGatewaysParams) {
    this.integration = params.integration;

    this.authorizedGateways = ko.observableArray();

    this.integration.core.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedGateways.push(
          new MerchantStatus(GatewayUrl(val.toString()), true),
        );
      },
    });

    this.getAuthorizedGateways();
  }

  openMerchantIFrameClick = (merchantStatus: MerchantStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.displayMerchantIFrame(merchantStatus.merchantUrl);
    });
  };

  deauthorizeMerchantClick = (merchantStatus: MerchantStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.core
        .deauthorizeMerchant(merchantStatus.merchantUrl)
        .map(() => {
          this.getAuthorizedGateways();
        });
    });
  };

  getAuthorizedGateways() {
    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getAuthorizedGatewaysConnectorsStatus();
      })
      .map((merchantsMap) => {
        const merchantStrings = new Array<MerchantStatus>();
        for (const [merchantUrl, status] of merchantsMap.entries()) {
          merchantStrings.push(new MerchantStatus(merchantUrl, status));
        }
        this.authorizedGateways(merchantStrings);
      });
  }
}

ko.components.register("authorized-merchants", {
  viewModel: AuthorizedGatewaysViewModel,
  template: html,
});
