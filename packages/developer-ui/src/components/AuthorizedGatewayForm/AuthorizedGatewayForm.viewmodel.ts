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
  public gatewayUrl: ko.Observable<GatewayUrl>;
  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;

  constructor(params: AuthorizedGatewayFormParams) {
    this.integration = params.integration;
    this.gatewayUrl = ko.observable(
      GatewayUrl("http://localhost:8080/hypernet_protocol/v0"),
    );

    this.submitButton = new ButtonParams(
      "Authorize Gateway",
      async () => {
        return await this.integration.core.authorizeGateway(this.gatewayUrl());
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        return this.gatewayUrl() !== "";
      }),
    );
  }
}

ko.components.register("authorized-gateway-form", {
  viewModel: AuthorizedGatewayFormViewModel,
  template: html,
});
