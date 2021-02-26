import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import html from "./AuthorizedMerchants.template.html";

export class AuthorizedMerchantsParams {
  constructor(public core: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantsViewModel {
  public authorizedMerchants: ko.ObservableArray<string>;

  protected core: IHypernetWebIntegration;

  constructor(params: AuthorizedMerchantsParams) {
    this.core = params.core;

    this.authorizedMerchants = ko.observableArray();

    this.core.proxy.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedMerchants.push(val.toString());
      },
    });

    this.core
      .getReady()
      .andThen(() => {
        return this.core.proxy.getAuthorizedMerchants();
      })
      .map((merchants) => {
        const merchantStrings = new Array<string>();
        for (const keyval of merchants) {
          merchantStrings.push(keyval[0].toString());
        }
        this.authorizedMerchants(merchantStrings);
      });
  }
}

ko.components.register("authorized-merchants", {
  viewModel: AuthorizedMerchantsViewModel,
  template: html,
});
