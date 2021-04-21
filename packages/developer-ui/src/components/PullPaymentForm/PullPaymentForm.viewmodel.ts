import { EthereumAddress, PublicIdentifier } from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { utils } from "ethers";
import ko from "knockout";
import moment from "moment";

import { AuthorizedMerchantSelectorParams } from "../AuthorizedMerchantSelector/AuthorizedMerchantSelector.viewmodel";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";

import html from "./PullPaymentForm.template.html";

export class PullPaymentFormParams {
  constructor(
    public integration: IHypernetWebIntegration,
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
  public merchantSelector: AuthorizedMerchantSelectorParams;

  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;
  protected counterparty: ko.Observable<PublicIdentifier> | ko.Computed<PublicIdentifier>;

  constructor(params: PullPaymentFormParams) {
    this.integration = params.integration;
    this.counterparty = params.counterparty;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");
    this.deltaAmount = ko.observable("0");
    this.deltaTime = ko.observable("0");

    this.tokenSelector = new TokenSelectorParams(this.integration, ko.observable(null), true);
    this.merchantSelector = new AuthorizedMerchantSelectorParams(this.integration, ko.observable(null));

    this.submitButton = new ButtonParams(
      "Submit Payment",
      async () => {
        const selectedPaymentTokenAddress = this.tokenSelector.selectedToken();

        if (selectedPaymentTokenAddress == null) {
          return null;
        }

        const selectedMerchantUrl = this.merchantSelector.selectedAuthorizedMerchant();

        if (selectedMerchantUrl == null) {
          return null;
        }

        try {
          const expirationDate = moment(this.expirationDate()).unix();
          const amount = utils.parseUnits(this.amount(), "wei");
          const requiredStake = utils.parseUnits(this.requiredStake(), "wei");
          const deltaAmount = utils.parseUnits(this.deltaAmount(), "wei");
          const deltaTime = Number(this.deltaTime());

          return await this.integration.core.authorizeFunds(
            this.counterparty(),
            amount,
            expirationDate,
            deltaAmount.toString(),
            deltaTime,
            requiredStake,
            selectedPaymentTokenAddress,
            selectedMerchantUrl,
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
