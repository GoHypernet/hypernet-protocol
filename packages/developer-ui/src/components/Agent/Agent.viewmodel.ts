import ko from "knockout";
import html from "./Agent.template.html";
import { HypernetCore, IHypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";
import { AccountParams } from "../Account/Account.viewmodel";
import { ActionsParams } from "../Actions/Actions.viewmodel";
import { StatusParams } from "../Status/Status.viewmodel";
import { AuthorizedMerchantFormParams } from "../AuthorizedMerchantForm/AuthorizedMerchantForm.viewmodel";
import { AuthorizedMerchantsParams } from "../AuthorizedMerchants/AuthorizedMerchants.viewmodel";

export class AgentViewModel {
  public account: AccountParams;
  public links: LinksParams;
  public balances: BalancesParams;
  public authorizedMerchants: AuthorizedMerchantsParams;
  public actions: ActionsParams;
  public status: StatusParams;
  public message: ko.Observable<string>;

  public paymentForm: PaymentFormParams;
  public merchantForm: AuthorizedMerchantFormParams;

  protected core: IHypernetCore;

  constructor() {
    this.core = new HypernetCore(EBlockchainNetwork.Localhost);
    this.status = new StatusParams(this.core);

    this.account = new AccountParams(this.core);
    this.message = ko.observable<string>("Starting");

    this.startup();

    this.links = new LinksParams(this.core);
    this.actions = new ActionsParams(this.core);
    this.balances = new BalancesParams(this.core);
    this.authorizedMerchants = new AuthorizedMerchantsParams(this.core);
    this.paymentForm = new PaymentFormParams(this.core);
    this.merchantForm = new AuthorizedMerchantFormParams(this.core);
  }

  protected startup(): Promise<void> {
    return this.core
      .getEthereumAccounts()
      .andThen((accounts) => {
        return this.core.initialize(accounts[0]);
      })
      .match(
        () => {
          this.message("Startup Complete");
        },
        (e) => {
          this.message("Startup failed!");
          // tslint:disable-next-line: no-console
          console.log("Startup failed!");
          // tslint:disable-next-line: no-console
          console.log(e);
        },
      );
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
