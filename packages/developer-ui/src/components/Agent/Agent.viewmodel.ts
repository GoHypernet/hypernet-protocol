import ko from "knockout";
import html from "./Agent.template.html";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";
import { AccountParams } from "../Account/Account.viewmodel";
import { ActionsParams } from "../Actions/Actions.viewmodel";
import { StatusParams } from "../Status/Status.viewmodel";
import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { AuthorizedMerchantFormParams } from "../AuthorizedMerchantForm/AuthorizedMerchantForm.viewmodel";
import { AuthorizedMerchantsParams } from "../AuthorizedMerchants/AuthorizedMerchants.viewmodel";
import { ExternalProviderUtils } from "packages/utils";

declare global {
  interface Window {
    ethereum: any;
  }
}

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

  protected integration: IHypernetWebIntegration;

  constructor() {
    this.integration = new HypernetWebIntegration();
    this.status = new StatusParams(this.integration);

    this.account = new AccountParams(this.integration);
    this.message = ko.observable<string>("Starting");

    this.startup();

    this.links = new LinksParams(this.integration);
    this.actions = new ActionsParams(this.integration);
    this.balances = new BalancesParams(this.integration);
    this.authorizedMerchants = new AuthorizedMerchantsParams(this.integration);
    this.paymentForm = new PaymentFormParams(this.integration);
    this.merchantForm = new AuthorizedMerchantFormParams(this.integration);
  }

  protected startup(): Promise<void> {
    return this.integration.getReady().match(
      () => {
        this.message("Startup Complete");
      },
      (e) => {
        this.message("Startup failed!");
        console.log(e);
      },
    );
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
