import ko from "knockout";
import { BigNumber, EthereumAddress, IHypernetCore, PublicIdentifier } from "@hypernetlabs/hypernet-core";
import html from "./PullPaymentForm.template.html";
import moment from "moment";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";
import { utils } from "ethers"

export class PullPaymentFormParams {
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
export class PullPaymentFormViewModel {
  public requiredStake: ko.Observable<string>;
  public expirationDate: ko.Observable<string>;
  public amount: ko.Observable<string>;
  public deltaAmount: ko.Observable<string>;
  public deltaTime: ko.Observable<string>;
  public tokenSelector: TokenSelectorParams;

  public submitButton: ButtonParams;

  protected core: IHypernetCore;
  protected counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>;

  constructor(params: PullPaymentFormParams) {
    this.core = params.core;
    this.counterparty = params.counterparty;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");
    this.deltaAmount = ko.observable("0");
    this.deltaTime = ko.observable("0");

    this.tokenSelector = new TokenSelectorParams(this.core, ko.observable(null), true);

    this.submitButton = new ButtonParams(
      "Submit Payment",
      async () => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

        if (selectedPaymentTokenAddress == null) {
          return null;
        }

        try {
          const expirationDate = moment(this.expirationDate()).unix();
          const amount = utils.parseUnits(this.amount(), "wei");
          const requiredStake = utils.parseUnits(this.requiredStake(), "wei");
          const deltaAmount = utils.parseUnits(this.deltaAmount(), "wei");
          const deltaTime = Number(this.deltaTime());

          return await this.core.authorizeFunds(
            this.counterparty(),
            amount,
            expirationDate,
            deltaAmount.toString(),
            deltaTime,
            requiredStake,
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
          moment(this.expirationDate())
          utils.parseUnits(this.amount(), "wei");
          utils.parseUnits(this.requiredStake(), "wei");
          utils.parseUnits(this.deltaAmount(), "wei");
          Number(this.deltaTime());

          return true;
        } catch {
          return false;
        }
      }),
    );
  }
}

ko.components.register("pull-payment-form", {
  viewModel: PullPaymentFormViewModel,
  template: html,
});
