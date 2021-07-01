import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./AuthorizedGatewaySelector.template.html";

export class AuthorizedGatewaySelectorParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public selectedAuthorizedGateway: ko.Observable<GatewayUrl | null>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewayOption {
  constructor(public gatewayName: string, public url: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewaySelectorViewModel {
  public authorizedGatewayOptions: ko.ObservableArray<AuthorizedGatewayOption>;
  public selectedAuthorizedGatewayOption: ko.Computed<AuthorizedGatewayOption | null>;

  protected integration: IHypernetWebIntegration;
  protected selectedAuthorizedGateway: ko.Observable<string | null>;
  protected gateways: ko.Observable<string[] | null>;

  constructor(params: AuthorizedGatewaySelectorParams) {
    this.integration = params.integration;
    this.selectedAuthorizedGateway = params.selectedAuthorizedGateway;

    this.gateways = ko.observable(null);
    this.authorizedGatewayOptions = ko.observableArray<AuthorizedGatewayOption>();

    this.integration.core.onGatewayAuthorized.subscribe((gateway) => {
      const url = gateway.toString();
      this.authorizedGatewayOptions.push(
        new AuthorizedGatewayOption(url, url),
      );
    });

    this.selectedAuthorizedGatewayOption = ko.pureComputed({
      read: () => {
        const selectedAuthorizedGateway = this.selectedAuthorizedGateway();
        if (selectedAuthorizedGateway == null) {
          // tslint:disable-next-line: no-console
          console.log("No selected gateway.");
          return null;
        }

        const options = this.authorizedGatewayOptions();

        for (const option of options) {
          if (option.url === selectedAuthorizedGateway) {
            // tslint:disable-next-line: no-console
            console.log(`Selected token: ${option.url}`);
            return option;
          }
        }

        // The selected token is not actually an option...
        // console.log("No selected token.")
        this.selectedAuthorizedGateway(null);
        return null;
      },

      write: (val) => {
        // console.log(`Selected token (write) ${val}`)
        this.selectedAuthorizedGateway(val == null ? null : val.url);
      },
    });

    this.getAuthorizedGateways();
  }

  protected getAuthorizedGateways() {
    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getAuthorizedGateways();
      })
      .map((authorizedGateways) => {
        const authorizedGatewayOptions = new Array<AuthorizedGatewayOption>();
        for (const keyVal of authorizedGateways) {
          // TODO: Convert the URL to a comercial name
          const url = keyVal[0].toString();
          authorizedGatewayOptions.push(
            new AuthorizedGatewayOption(url, url),
          );
        }

        this.authorizedGatewayOptions(authorizedGatewayOptions);
      })
      .mapErr(() => {
        // tslint:disable-next-line: no-console
        console.log("No balances.");
      });
  }
}

ko.components.register("authorized-gateway-selector", {
  viewModel: AuthorizedGatewaySelectorViewModel,
  template: html,
});
