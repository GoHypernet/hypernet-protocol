import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { MerchantUrl } from "@hypernetlabs/objects";
import html from "./AuthorizedMerchantSelector.template.html";

export class AuthorizedMerchantSelectorParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public selectedAuthorizedMerchant: ko.Observable<MerchantUrl | null>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantOption {
  constructor(public merchantName: string, public url: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantSelectorViewModel {
  public authorizedMerchantOptions: ko.ObservableArray<AuthorizedMerchantOption>;
  public selectedAuthorizedMerchantOption: ko.Computed<AuthorizedMerchantOption | null>;

  protected integration: IHypernetWebIntegration;
  protected selectedAuthorizedMerchant: ko.Observable<string | null>;
  protected merchants: ko.Observable<string[] | null>;

  constructor(params: AuthorizedMerchantSelectorParams) {
    this.integration = params.integration;
    this.selectedAuthorizedMerchant = params.selectedAuthorizedMerchant;

    this.merchants = ko.observable(null);
    this.authorizedMerchantOptions = ko.observableArray<AuthorizedMerchantOption>();

    this.integration.core.onMerchantAuthorized.subscribe((merchant) => {
      const url = merchant.toString();
      this.authorizedMerchantOptions.push(new AuthorizedMerchantOption(url, url));
    });

    this.selectedAuthorizedMerchantOption = ko.pureComputed({
      read: () => {
        const selectedAuthorizedMerchant = this.selectedAuthorizedMerchant();
        if (selectedAuthorizedMerchant == null) {
          // tslint:disable-next-line: no-console
          console.log("No selected merchant.");
          return null;
        }

        const options = this.authorizedMerchantOptions();

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

    this.getAuthorizedMerchants();
  }

  protected getAuthorizedMerchants() {
    this.integration.core
      .waitInitialized()
      .andThen(() => {
        return this.integration.core.getAuthorizedMerchants();
      })
      .map((authorizedMerchants) => {
        const authorizedMerchantOptions = new Array<AuthorizedMerchantOption>();
        for (const keyVal of authorizedMerchants) {
          // TODO: Convert the URL to a comercial name
          const url = keyVal[0].toString();
          authorizedMerchantOptions.push(new AuthorizedMerchantOption(url, url));
        }

        this.authorizedMerchantOptions(authorizedMerchantOptions);
      })
      .mapErr(() => {
        // tslint:disable-next-line: no-console
        console.log("No balances.");
      });
  }
}

ko.components.register("authorized-merchant-selector", {
  viewModel: AuthorizedMerchantSelectorViewModel,
  template: html,
});
