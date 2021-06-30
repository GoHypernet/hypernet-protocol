import { GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import ko from "knockout";

import html from "./AuthorizedGatewaySelector.template.html";

export class AuthorizedGatewaySelectorParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public selectedAuthorizedMerchant: ko.Observable<GatewayUrl | null>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantOption {
  constructor(public merchantName: string, public url: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedGatewaySelectorViewModel {
  public authorizedGatewayOptions: ko.ObservableArray<AuthorizedMerchantOption>;
  public selectedAuthorizedMerchantOption: ko.Computed<AuthorizedMerchantOption | null>;

  protected integration: IHypernetWebIntegration;
  protected selectedAuthorizedMerchant: ko.Observable<string | null>;
  protected merchants: ko.Observable<string[] | null>;

  constructor(params: AuthorizedGatewaySelectorParams) {
    this.integration = params.integration;
    this.selectedAuthorizedMerchant = params.selectedAuthorizedMerchant;

    this.merchants = ko.observable(null);
    this.authorizedGatewayOptions = ko.observableArray<AuthorizedMerchantOption>();

    this.integration.core.onMerchantAuthorized.subscribe((merchant) => {
      const url = merchant.toString();
      this.authorizedGatewayOptions.push(
        new AuthorizedMerchantOption(url, url),
      );
    });

    this.selectedAuthorizedMerchantOption = ko.pureComputed({
      read: () => {
        const selectedAuthorizedMerchant = this.selectedAuthorizedMerchant();
        if (selectedAuthorizedMerchant == null) {
          // tslint:disable-next-line: no-console
          console.log("No selected merchant.");
          return null;
        }

        const options = this.authorizedGatewayOptions();

        for (const option of options) {
          if (option.url === selectedAuthorizedMerchant) {
            // tslint:disable-next-line: no-console
            console.log(`Selected token: ${option.url}`);
            return option;
          }
        }

        // The selected token is not actually an option...
        // console.log("No selected token.")
        this.selectedAuthorizedMerchant(null);
        return null;
      },

      write: (val) => {
        // console.log(`Selected token (write) ${val}`)
        this.selectedAuthorizedMerchant(val == null ? null : val.url);
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
        const authorizedGatewayOptions = new Array<AuthorizedMerchantOption>();
        for (const keyVal of authorizedGateways) {
          // TODO: Convert the URL to a comercial name
          const url = keyVal[0].toString();
          authorizedGatewayOptions.push(
            new AuthorizedMerchantOption(url, url),
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

ko.components.register("authorized-merchant-selector", {
  viewModel: AuthorizedGatewaySelectorViewModel,
  template: html,
});
