import * as ko from "knockout";
import { Balances, EthereumAddress, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./PushPaymentForm.template.html";
import moment from "moment";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { BigNumber, PublicIdentifier } from "@hypernetlabs/hypernet-core/lib/interfaces/objects";

export class PushPaymentFormParams {
  constructor(
    public core: IHypernetCore,
    public counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>,
  ) {}
}

export class PaymentTokenOption {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PushPaymentFormViewModel {
  public requiredStake: ko.Observable<string>;
  public expirationDate: ko.Observable<string>;
  public amount: ko.Observable<string>;
  public paymentTokens: ko.PureComputed<PaymentTokenOption[]>;
  public selectedPaymentToken: ko.Observable<PaymentTokenOption | null>;

  public submitButton: ButtonParams;

  protected core: IHypernetCore;
  protected balances: ko.Observable<Balances | null>;
  protected counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>;

  constructor(params: PushPaymentFormParams) {
    this.core = params.core;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");
    this.balances = ko.observable(null);
    this.paymentTokens = ko.pureComputed<PaymentTokenOption[]>(() => {
      const balances = this.balances();
      if (balances == null) {
        return [];
      }

      const retArr = new Array<PaymentTokenOption>();
      for (const assetBalance of balances.assets) {
        // TODO: Convert the asset address to a readable name!
        retArr.push(new PaymentTokenOption(assetBalance.assetAddresss, assetBalance.assetAddresss));
      }

      return retArr;
    });
    this.selectedPaymentToken = ko.observable(null);
    this.counterparty = params.counterparty;

    this.submitButton = new ButtonParams(
      "Submit Payment",
      () => {
        const selectedPaymentTokenAddress = this.selectedPaymentToken()?.address;

        if (selectedPaymentTokenAddress == null) {
          return null;
        }

        try {
          const expirationDate = moment(this.expirationDate());
          const amount = BigNumber.from(this.amount());
          const requiredStake = BigNumber.from(this.requiredStake());

          return this.core.sendFunds(
            this.counterparty(),
            amount,
            expirationDate,
            requiredStake,
            selectedPaymentTokenAddress,
            "galileo",
          );
        } catch {
          return null;
        }
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        const selectedPaymentTokenAddress = this.selectedPaymentToken()?.address;

        if (selectedPaymentTokenAddress == null) {
          return false;
        }

        try {
          moment(this.expirationDate());
          BigNumber.from(this.amount());
          BigNumber.from(this.requiredStake());

          return true;
        } catch {
          return false;
        }
      }),
    );

    this.getBalances();
  }

  protected async getBalances() {
    const balances = await this.core.getBalances();

    this.balances(balances);
  }
}

ko.components.register("push-payment-form", {
  viewModel: PushPaymentFormViewModel,
  template: html,
});
