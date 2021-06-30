import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./AuthorizedGateways.template.html";

export class AuthorizedGatewaysParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

export class GatewayStatus {
  constructor(public gatewayUrl: GatewayUrl, public status: boolean) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewaysViewModel {
  public authorizedGateways: ko.ObservableArray<GatewayStatus>;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedGatewaysParams) {
    this.integration = params.integration;

    this.authorizedGateways = ko.observableArray();

    this.integration.core.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedGateways.push(
          new GatewayStatus(GatewayUrl(val.toString()), true),
        );
      },
    });

    this.getAuthorizedGateways();
  }

  openMerchantIFrameClick = (merchantStatus: GatewayStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.displayMerchantIFrame(merchantStatus.gatewayUrl);
    });
  };

  deauthorizeMerchantClick = (merchantStatus: GatewayStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.core
        .deauthorizeMerchant(merchantStatus.gatewayUrl)
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
        const merchantStrings = new Array<GatewayStatus>();
        for (const [gatewayUrl, status] of merchantsMap.entries()) {
          merchantStrings.push(new GatewayStatus(gatewayUrl, status));
        }
        this.authorizedGateways(merchantStrings);
      });
  }
}

ko.components.register("authorized-merchants", {
  viewModel: AuthorizedGatewaysViewModel,
  template: html,
});
