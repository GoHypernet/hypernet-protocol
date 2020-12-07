import * as ko from "knockout";
import html from "./Agent.template.html";
import { HypernetCore, IHypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";
import { AccountParams } from "../Account/Account.viewmodel";
import { ActionsParams } from "../Actions/Actions.viewmodel";
import { StatusParams } from "../Status/Status.viewmodel";

export class AgentViewModel {
  public account: AccountParams;
  public links: LinksParams;
  public balances: BalancesParams;
  public actions: ActionsParams;
  public status: StatusParams;
  public message: ko.Observable<string>;
  
  public paymentForm: PaymentFormParams;

  protected core: IHypernetCore;

  constructor() {
    this.core = new HypernetCore(EBlockchainNetwork.Localhost);
    this.status = new StatusParams(this.core)

    this.account = new AccountParams(this.core);
    this.message = ko.observable<string>("Starting");
    
    this.startup()
      .then(() => {
        this.message("Startup Complete");
      })
      .catch((e) => {
        this.message("Startup failed!");
        console.log("Startup failed!");
        console.log(e);
      });

    this.links = new LinksParams(this.core);
    this.actions = new ActionsParams(this.core);
    this.balances = new BalancesParams(this.core);
    this.paymentForm = new PaymentFormParams(this.core);
  }

  protected async startup() {
    try {
      const accounts = await this.core.getEthereumAccounts();
      await this.core.initialize(accounts[0]);
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