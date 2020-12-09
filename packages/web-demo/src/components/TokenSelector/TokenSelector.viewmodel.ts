import * as ko from "knockout";
import { Balances, EthereumAddress, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./TokenSelector.template.html";

export class TokenSelectorParams {
  constructor(
    public core: IHypernetCore,
    public selectedToken: ko.Observable<EthereumAddress | null>,
    public onlyWithBalance: boolean,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentTokenOption {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}

// tslint:disable-next-line: max-classes-per-file
export class TokenSelectorViewModel {
  public paymentTokens: ko.ObservableArray<PaymentTokenOption>;
  public selectedPaymentTokenOption: ko.Computed<PaymentTokenOption | null>;

  protected core: IHypernetCore;
  protected selectedToken: ko.Observable<EthereumAddress | null>;
  protected balances: ko.Observable<Balances | null>;
  protected onlyWithBalance: boolean;
  
  constructor(params: TokenSelectorParams) {
    this.core = params.core;
    this.selectedToken = params.selectedToken;
    this.onlyWithBalance = params.onlyWithBalance;

    this.balances = ko.observable(null);
    this.paymentTokens = ko.observableArray<PaymentTokenOption>();

    this.selectedPaymentTokenOption = ko.pureComputed({
      read: () => {
        const selectedToken = this.selectedToken();
        if (selectedToken == null) {
          console.log("No selected token.")
          return null;
        }

        const options = this.paymentTokens();

        for (const option of options) {
          if (option.address === selectedToken) {
            // console.log(`Selected token: ${option.address}`)
            return option;
          }
        }

        // The selected token is not actually an option...
        // console.log("No selected token.")
        this.selectedToken(null);
        return null;
      },

      write: (val) => {
        // console.log(`Selected token (write) ${val}`)
        this.selectedToken(val == null ? null : val.address);
      }
    });

    this.getBalances();
  }

  protected async getBalances() {
    if (this.onlyWithBalance) {
      await this.core.initialized();
      const balances = await this.core.getBalances();

      if (balances == null) {
        console.log("No balances.")
        return [];
      }

      const paymentTokens = new Array<PaymentTokenOption>();
      for (const assetBalance of balances.assets) {
        // TODO: Convert the asset address to a readable name!
        paymentTokens.push(new PaymentTokenOption(assetBalance.assetAddresss, assetBalance.assetAddresss));
      }

      this.paymentTokens(paymentTokens);
    }
    else {
      const eth = new PaymentTokenOption("ETH", "0x0000000000000000000000000000000000000000");
      const test = new PaymentTokenOption("Test Token", "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0");
      this.paymentTokens([eth, test])
    }
  }
}

ko.components.register("token-selector", {
  viewModel: TokenSelectorViewModel,
  template: html,
});
