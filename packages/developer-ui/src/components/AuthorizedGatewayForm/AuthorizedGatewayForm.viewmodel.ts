import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";

import html from "./AuthorizedGatewayForm.template.html";

export class AuthorizedGatewayFormParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewayFormViewModel {
  public merchantUrl: ko.Observable<GatewayUrl>;
  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedGatewayFormParams) {
    this.integration = params.integration;
    this.merchantUrl = ko.observable(
      GatewayUrl("http://localhost:8080/hypernet_protocol/v0"),
    );

    this.submitButton = new ButtonParams(
      "Authorize Gateway",
      async () => {
        return await this.integration.core.authorizeMerchant(
          this.merchantUrl(),
        );
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        return this.merchantUrl() !== "";
      }),
    );
  }
}

ko.components.register("authorized-merchant-form", {
  viewModel: AuthorizedGatewayFormViewModel,
  template: html,
});
