import ko from "knockout";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./AuthorizedMerchantForm.template.html";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";

export class AuthorizedMerchantFormParams {
  constructor(public core: IHypernetCore) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantFormViewModel {
  public merchantUrl: ko.Observable<string>;
  public submitButton: ButtonParams;

  protected core: IHypernetCore;

  constructor(params: AuthorizedMerchantFormParams) {
    this.core = params.core;
    this.merchantUrl = ko.observable("");

    this.submitButton = new ButtonParams(
      "Authorize Merchant",
      async () => {
        return await this.core.authorizeMerchant(new URL(this.merchantUrl()));
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
