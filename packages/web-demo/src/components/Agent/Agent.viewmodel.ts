import * as ko from "knockout";
import html from "./Agent.template.html";
import { LinkParams } from "../Link/Link.viewmodel";
import { HypernetCore, IHypernetCore, Balances, HypernetLink, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import { ButtonParams } from "../Button/Button.viewmodel";
import { ethers } from "ethers";
import { BalancesParams } from "../Balances/Balances.viewmodel";
import { PaymentFormParams } from "../PaymentForm/PaymentForm.viewmodel";
import { LinksParams } from "../Links/Links.viewmodel";

class AvailableAccount {
  constructor(
    public accountName: string,
    public accountAddress: string,
    public privateKey: string,
    public publicIdentifier: string,
  ) {}
}

export class AgentViewModel {
  public links: LinksParams;
  public account: ko.Observable<AvailableAccount | null>;
  public publicIdentifier: ko.Observable<string>;
  public remoteAccount: ko.PureComputed<AvailableAccount>;
  public balances: BalancesParams;
  public pushPayment: ButtonParams;
  public depositFundsButton: ButtonParams;
  public message: ko.Observable<string>;
  public startupComplete: ko.Observable<boolean>;
  public inControl: ko.Observable<boolean>;
  public paymentForm: PaymentFormParams;

  protected core: IHypernetCore;
  protected availableAccounts: Array<AvailableAccount>;

  constructor() {
    this.core = new HypernetCore(EBlockchainNetwork.Localhost);

    this.availableAccounts = [
      new AvailableAccount(
        "Dave",
        "0xB6ECBa743E9fa53998Bc1F1265adf87F5CCaDc85",
        "0x9c9dbcc53c35a247b88818b5ef621666e4a8740c80a9f8dd1b987ce51dbb2b20",
        "indra5DayB8qS8N2fbqxTX8PiCJfKyUSUioQyb6xh633gsJcD9HUsCd",
      ),
      new AvailableAccount(
        "Carol",
        "0x1cD4FB2583d5BD5198D9Ac42243CD07393a8a2Fe",
        "0x0b96cbc41fd54d952fc148dbce05270cb9ba992a94725fe720ce11e51b106556",
        "indra6HBZ5W5wjZ7HuC81aJ8yuSPPCDX2UGhWH8NanWqj54SUF6DNj7",
      ),
    ];

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

    this.message = ko.observable<string>("Starting");
    this.startupComplete = ko.observable(false);
    this.inControl = ko.observable(false);
    
    this.startup()
      .then(() => {
        this.startupComplete(true);
        this.message("Startup Complete");

        return this.core.getPublicIdentifier();
      })
      .then((publicIdentifier: string) => {
        this.publicIdentifier(publicIdentifier);
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

    this.pushPayment = new ButtonParams("Push Payment", async () => {
      const account = this.account();
      const remoteAccount = this.remoteAccount();
      if (account == null || remoteAccount == null) {
        this.message(`Establish link aborted. Account: ${account}, remoteAccount: ${remoteAccount}`);
        return;
      }

      this.message(`Establishing link with ${remoteAccount}`);
      // const newLink = await this.core.openLink(remoteAccount.publicIdentifier, "0x0000000000000000000000000000000000000000", BigNumber.from(10), "dispute-mediator-public-key", null);
      // this.links.push(new LinkParams(ko.observable(newLink)));
      this.message(`Link established with ${remoteAccount}`);
    });

    this.account = ko.observable<AvailableAccount | null>(null);

    this.publicIdentifier = ko.observable("");
    this.links = new LinksParams(this.core, this.publicIdentifier);

    this.remoteAccount = ko.pureComputed<AvailableAccount>(() => {
      if (this.account()?.accountAddress === "0xB6ECBa743E9fa53998Bc1F1265adf87F5CCaDc85")
        return this.availableAccounts[1];

      return this.availableAccounts[0];
    });

    this.balances = new BalancesParams(this.core);
    this.paymentForm = new PaymentFormParams(
      this.core,
      ko.pureComputed(() => {
        return this.remoteAccount().publicIdentifier;
      }),
    );
  }

  protected async startup() {
    const accounts = await this.core.getEthereumAccounts();

    console.log(`Using account ${accounts[0]}`);

    const account = this.availableAccounts.find((val) => {
      return val.accountAddress == accounts[0];
    });

    if (account == null) {
      throw new Error("Chosen MetaMask account is not supported!");
    }

    this.account(account);

    console.log(account);

    await this.core.initialize(account.accountAddress, account.privateKey);

    console.log("core initialized!");
  }
}

ko.components.register("agent", {
  viewModel: AgentViewModel,
  template: html,
});
