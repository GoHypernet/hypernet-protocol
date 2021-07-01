import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import ko from "knockout";

import { AccountParams } from "../Account/Account.viewmodel";
import { ActionsParams } from "../Actions/Actions.viewmodel";
import { AuthorizedGatewayFormParams } from "../AuthorizedGatewayForm/AuthorizedGatewayForm.viewmodel";
import { AuthorizedGatewaysParams } from "../AuthorizedGateways/AuthorizedGateways.viewmodel";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { StatusParams } from "../Status/Status.viewmodel";

import html from "./Agent.template.html";

declare global {
  interface Window {
    ethereum: any;
  }
}

declare const __CORE_IFRAME_SOURCE__: string;

export class AgentViewModel {
  public account: AccountParams;
  public links: LinksParams;
  public balances: BalancesParams;
  public authorizedGateways: AuthorizedGatewaysParams;
  public actions: ActionsParams;
  public status: StatusParams;
  public message: ko.Observable<string>;

  public paymentForm: PaymentFormParams;
  public gatewayForm: AuthorizedGatewayFormParams;

  protected integration: IHypernetWebIntegration;

  constructor() {
    this.integration = new HypernetWebIntegration(__CORE_IFRAME_SOURCE__);
    this.status = new StatusParams(this.integration);

    this.account = new AccountParams(this.integration);
    this.message = ko.observable<string>("Starting");

    this.startup();

    this.links = new LinksParams(this.integration);
    this.actions = new ActionsParams(this.integration);
    this.balances = new BalancesParams(this.integration);
    this.authorizedGateways = new AuthorizedGatewaysParams(this.integration);
    this.paymentForm = new PaymentFormParams(this.integration);
    this.gatewayForm = new AuthorizedGatewayFormParams(this.integration);
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
