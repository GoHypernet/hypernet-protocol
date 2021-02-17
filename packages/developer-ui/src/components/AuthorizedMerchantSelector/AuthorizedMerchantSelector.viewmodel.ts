import ko from "knockout";
import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./AuthorizedMerchantSelector.template.html";

export class AuthorizedMerchantSelectorParams {
  constructor(public core: IHypernetCore, public selectedAuthorizedMerchant: ko.Observable<string | null>) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantOption {
  constructor(public merchantName: string, public url: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class AuthorizedMerchantSelectorViewModel {
  public authorizedMerchantOptions: ko.ObservableArray<AuthorizedMerchantOption>;
  public selectedAuthorizedMerchantOption: ko.Computed<AuthorizedMerchantOption | null>;

  protected core: IHypernetCore;
  protected selectedAuthorizedMerchant: ko.Observable<string | null>;
  protected merchants: ko.Observable<string[] | null>;

  constructor(params: AuthorizedMerchantSelectorParams) {
    this.core = params.core;
    this.selectedAuthorizedMerchant = params.selectedAuthorizedMerchant;

    this.merchants = ko.observable(null);
    this.authorizedMerchantOptions = ko.observableArray<AuthorizedMerchantOption>();

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
    this.core
      .waitInitialized()
      .andThen(() => {
        return this.core.getAuthorizedMerchants();
      })
      .map((authorizedMerchants) => {
        const authorizedMerchantOptions = new Array<AuthorizedMerchantOption>();
        for (const authorizedMerchant of authorizedMerchants) {
          // TODO: Convert the URL to a comercial name
          const url = authorizedMerchant.toString();
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
