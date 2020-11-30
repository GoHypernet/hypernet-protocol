import * as ko from "knockout";
import html from "./Agent.template.html";
import { HypernetCore, IHypernetCore, Balances, HypernetLink, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import { ButtonParams } from "../Button/Button.viewmodel";
import { ethers } from "ethers";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";
import { AccountParams } from "../Account/Account.viewmodel";

export class AgentViewModel {
  public account: AccountParams;
  public links: LinksParams;
  public balances: BalancesParams;
  public depositFundsButton: ButtonParams;
  public message: ko.Observable<string>;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;
  public paymentForm: PaymentFormParams;

  protected core: IHypernetCore;

  constructor() {
    this.core = new HypernetCore(EBlockchainNetwork.Localhost);

    this.core.onControlClaimed.subscribe({
      next: () => {
        this.inControl(true);
      },
    });

    this.core.onControlYielded.subscribe({
      next: () => {
        this.inControl(false);
      },
    });

    this.account = new AccountParams(this.core);
    this.message = ko.observable<string>("Starting");
    this.startupComplete = ko.observable(false);
    this.inControl = ko.observable(false);

    this.startup()
      .then(() => {
        this.startupComplete(true);
        this.message("Startup Complete");
      })
      .catch((e) => {
        this.message("Startup failed!");
        console.log("Startup failed!");
        console.log(e);
      });

    this.depositFundsButton = new ButtonParams("Deposit Funds", async () => {
      await this.core.depositFunds("0x0000000000000000000000000000000000000000", ethers.utils.parseEther("1"));
      this.message("Deposited 1 ETH into router channel");
    });

    this.links = new LinksParams(this.core);

    this.balances = new BalancesParams(this.core);
    this.paymentForm = new PaymentFormParams(this.core);
  }

  protected async startup() {
    try {
      await this.core.initialize("");

      this.startupComplete(true);
      this.message("Startup Complete");
    } catch (e) {
      this.message("Startup failed!");
      console.log("Startup failed!");
      console.log(e);
    }
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
