import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./AuthorizedMerchants.template.html";

export class AuthorizedMerchantsParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

export class MerchantStatus {
  constructor(public merchantUrl: GatewayUrl, public status: boolean) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantsViewModel {
  public authorizedMerchants: ko.ObservableArray<MerchantStatus>;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedMerchantsParams) {
    this.integration = params.integration;

    this.authorizedMerchants = ko.observableArray();

    this.integration.core.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedMerchants.push(
          new MerchantStatus(GatewayUrl(val.toString()), true),
        );
      },
    });

    this.getAuthorizedMerchants();
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
          this.getAuthorizedMerchants();
        });
    });
  };

  getAuthorizedMerchants() {
    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getAuthorizedMerchantsConnectorsStatus();
      })
      .map((merchantsMap) => {
        const merchantStrings = new Array<MerchantStatus>();
        for (const [merchantUrl, status] of merchantsMap.entries()) {
          merchantStrings.push(new MerchantStatus(merchantUrl, status));
        }
        this.authorizedMerchants(merchantStrings);
      });
  }
}

ko.components.register("authorized-merchants", {
  viewModel: AuthorizedMerchantsViewModel,
  template: html,
});
