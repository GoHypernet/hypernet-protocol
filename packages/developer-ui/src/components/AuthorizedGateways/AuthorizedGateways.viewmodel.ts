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

    this.integration.core.onGatewayAuthorized.subscribe({
      next: (val) => {
        this.authorizedGateways.push(
          new GatewayStatus(GatewayUrl(val.toString()), true),
        );
      },
    });

    this.getAuthorizedGateways();
  }

  openGatewayIFrameClick = (gatewayStatus: GatewayStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.displayGatewayIFrame(gatewayStatus.gatewayUrl);
    });
  };

  deauthorizeGatewayClick = (gatewayStatus: GatewayStatus) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.core
        .deauthorizeGateway(gatewayStatus.gatewayUrl)
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
      .map((gatewaysMap) => {
        const gatewayStrings = new Array<GatewayStatus>();
        for (const [gatewayUrl, status] of gatewaysMap.entries()) {
          gatewayStrings.push(new GatewayStatus(gatewayUrl, status));
        }
        this.authorizedGateways(gatewayStrings);
      });
  }
}

ko.components.register("authorized-gateways", {
  viewModel: AuthorizedGatewaysViewModel,
  template: html,
});
