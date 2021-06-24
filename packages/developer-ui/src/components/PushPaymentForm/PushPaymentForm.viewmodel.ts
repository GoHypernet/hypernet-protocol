import {
  BigNumberString,
  EthereumAddress,
  PublicIdentifier,
  UnixTimestamp,
} from "@hypernetlabs/objects";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { utils, BigNumber } from "ethers";
import ko from "knockout";
import moment from "moment";

import { AuthorizedMerchantSelectorParams } from "../AuthorizedMerchantSelector/AuthorizedMerchantSelector.viewmodel";
import { ButtonParams, EButtonType } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";

import html from "./PushPaymentForm.template.html";

export class PushPaymentFormParams {
  constructor(
    public integration: IHypernetWebIntegration,
    public counterparty:
      | ko.Observable<PublicIdentifier>
      | ko.Computed<PublicIdentifier>,
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
  public merchantSelector: AuthorizedMerchantSelectorParams;

  public submitButton: ButtonParams;

  protected integration: IHypernetWebIntegration;
  protected counterparty:
    | ko.Observable<PublicIdentifier>
    | ko.Computed<PublicIdentifier>;

  constructor(params: PushPaymentFormParams) {
    this.integration = params.integration;
    this.counterparty = params.counterparty;

    this.requiredStake = ko.observable("0");
    this.expirationDate = ko.observable(moment().format());
    this.amount = ko.observable("0");

    this.tokenSelector = new TokenSelectorParams(
      this.integration,
      ko.observable(null),
      true,
    );

    this.merchantSelector = new AuthorizedMerchantSelectorParams(
      this.integration,
      ko.observable(null),
    );

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
          const expirationDate = moment(this.expirationDate());
          const amount = BigNumberString(
            utils.parseUnits(this.amount(), "wei").toString(),
          );
          const requiredStake = BigNumberString(
            utils.parseUnits(this.requiredStake(), "wei").toString(),
          );

          return await this.integration.core.sendFunds(
            this.counterparty(),
            amount,
            UnixTimestamp(expirationDate.unix()),
            requiredStake,
            selectedPaymentTokenAddress,
            selectedMerchantUrl,
            null,
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
