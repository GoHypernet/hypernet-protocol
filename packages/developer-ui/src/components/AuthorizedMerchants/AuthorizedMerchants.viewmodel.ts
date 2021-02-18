import ko from "knockout";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./AuthorizedMerchants.template.html";

export class AuthorizedMerchantsParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantsViewModel {
  public authorizedMerchants: ko.ObservableArray<string>;

  protected core: IHypernetCore;

  constructor(params: AuthorizedMerchantsParams) {
    this.core = params.core;

    this.authorizedMerchants = ko.observableArray();

    this.core.onMerchantAuthorized.subscribe({
      next: (val) => {
        this.authorizedMerchants.push(val.toString());
      },
    });

    this.core
      .waitInitialized()
      .andThen(() => {
        return this.core.getAuthorizedMerchants();
      })
      .map((merchants) => {

        const merchantStrings = new Array<string>();
        for(const keyval of merchants) {
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
