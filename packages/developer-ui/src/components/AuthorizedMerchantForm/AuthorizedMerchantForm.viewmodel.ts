import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import html from "./AuthorizedMerchantForm.template.html";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";

export class AuthorizedMerchantFormParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantFormViewModel {
  public merchantUrl: ko.Observable<string>;
  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedMerchantFormParams) {
    this.integration = params.integration;
    this.merchantUrl = ko.observable("http://localhost:5010");

    this.submitButton = new ButtonParams(
      "Authorize Merchant",
      async () => {
        return await this.integration.core.authorizeMerchant(this.merchantUrl());
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        return this.merchantUrl() !== "";
      }),
    );
  }
}

ko.components.register("authorized-merchant-form", {
  viewModel: AuthorizedMerchantFormViewModel,
  template: html,
});
