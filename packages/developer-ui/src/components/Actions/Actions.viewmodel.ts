import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { ethers } from "ethers";
import ko from "knockout";

import { ButtonParams } from "../Button/Button.viewmodel";
import { TokenSelectorParams } from "../TokenSelector/TokenSelector.viewmodel";

import html from "./Actions.template.html";

export class ActionsParams {
  constructor(public integration: IHypernetWebIntegration) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ActionsViewModel {
  public startupComplete: ko.Observable<boolean>;
  public depositFundsButton: ButtonParams;
  public mintTestTokenButton: ButtonParams;
  public tokenSelector: TokenSelectorParams;
  public tokenSelected: ko.PureComputed<boolean>;

  protected integration: IHypernetWebIntegration;

  constructor(params: ActionsParams) {
    this.integration = params.integration;

    this.startupComplete = ko.observable(false);

    this.tokenSelector = new TokenSelectorParams(this.integration, ko.observable(null), false);

    this.tokenSelected = ko.pureComputed(() => {
      return this.tokenSelector.selectedToken() != null;
    });

    this.depositFundsButton = new ButtonParams("Deposit Funds", async () => {
      const selectedToken = this.tokenSelector.selectedToken();

      if (selectedToken == null) {
        return;
      }

      // tslint:disable-next-line: no-console
      console.log(`Selected token for deposit: ${selectedToken}`);
      await this.integration.core.depositFunds(selectedToken, ethers.utils.parseEther("1"));
    });

    this.mintTestTokenButton = new ButtonParams("Mint HyperToken", async () => {
      const selectedToken = this.tokenSelector.selectedToken();

      if (selectedToken == null) {
        return;
      }

      await this.integration.core.mintTestToken(ethers.utils.parseEther("1"));
    });

    this.integration.core.waitInitialized().map(() => {
      this.startupComplete(true);
    });
  }
}

ko.components.register("actions", {
  viewModel: ActionsViewModel,
  template: html,
});
