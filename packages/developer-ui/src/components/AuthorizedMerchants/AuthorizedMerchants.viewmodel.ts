import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import html from "./AuthorizedMerchants.template.html";

export class AuthorizedMerchantsParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantsViewModel {
  public authorizedMerchants: ko.ObservableArray<string>;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedMerchantsParams) {
    this.integration = params.integration;

    this.authorizedMerchants = ko.observableArray();

    this.integration.core.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedMerchants.push(val.toString());
      },
    });

    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getAuthorizedMerchants();
      })
      .map((merchants) => {
        const merchantStrings = new Array<string>();
        for (const keyval of merchants) {
          merchantStrings.push(keyval[0].toString());
        }
        this.authorizedMerchants(merchantStrings);
      });
  }

  openMerchantIFrameClick = (merchantUrl: string) => {
    this.integration.core.waitInitialized().map(() => {
      this.integration.displayMerchantIFrame(merchantUrl);
    });
  };
}

ko.components.register("authorized-merchants", {
  viewModel: AuthorizedMerchantsViewModel,
  template: html,
});
