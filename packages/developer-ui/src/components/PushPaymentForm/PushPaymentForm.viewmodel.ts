import ko from "knockout";
import { BigNumber, EthereumAddress, IHypernetCore, PublicIdentifier } from "@hypernetlabs/hypernet-core";
import html from "./PushPaymentForm.template.html";
import moment from "moment";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";
import { utils } from "ethers"

export class PushPaymentFormParams {
  constructor(
    public core: IHypernetCore,
    public counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentTokenOption {
  constructor(public tokenName: string, public address: EthereumAddress) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PushPaymentFormViewModel {
  public requiredStake: ko.Observable<string>;
  public expirationDate: ko.Observable<string>;
  public amount: ko.Observable<string>;
  public tokenSelector: TokenSelectorParams;

  public submitButton: ButtonParams;

  protected core: IHypernetCore;
  protected counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>;

  constructor(params: PushPaymentFormParams) {
    this.core = params.core;
    this.counterparty = params.counterparty;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");

    this.tokenSelector = new TokenSelectorParams(this.core, ko.observable(null), true);

    this.submitButton = new ButtonParams(
      "Submit Payment",
      async () => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

        if (selectedPaymentTokenAddress == null) {
          return null;
        }

        try {
          const expirationDate = moment(this.expirationDate());
          const amount = utils.parseUnits(this.amount(), "wei");
          const requiredStake = utils.parseUnits(this.requiredStake(), "wei");

          return await this.core.sendFunds(
            this.counterparty(),
            amount.toString(),
            expirationDate.unix(),
            requiredStake.toString(),
            selectedPaymentTokenAddress,
            "0x0000000000000000000000000000000000000001", // @todo replace with an actual mediator address!
          );
        } catch {
          return null;
        }
      },
      EButtonType.Normal,
      ko.pureComputed(() => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

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
  }
}

ko.components.register("push-payment-form", {
  viewModel: PushPaymentFormViewModel,
  template: html,
});
