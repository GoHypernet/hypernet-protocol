import * as ko from "knockout";
import { EstablishLinkRequestWithApproval, EthereumAddress, PublicKey } from "@hypernetlabs/hypernet-core";
import html from "./ProposedLink.template.html";
import { ButtonParams } from "../Button/Button.viewmodel";
import { EProposedLinkStatus } from "web-demo/src/types/EProposedLinkStatus";

export class ProposedLinkParams {
  constructor(
    public establishLinkRequest: EstablishLinkRequestWithApproval,
    public status: ko.Observable<EProposedLinkStatus>,
  ) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProposedLinkViewModel {
  public id: string;
  public consumer: EthereumAddress;
  public provider: EthereumAddress;
  public paymentToken: EthereumAddress;
  public disputeMediator: PublicKey;
  public threadAddress: string;
  public statusString: ko.PureComputed<string>;
  public showButtons: ko.PureComputed<boolean>;

  protected status: ko.Observable<EProposedLinkStatus>;
  protected approveFunc: (approve: boolean) => void;

  public approveButton: ButtonParams;
  public denyButton: ButtonParams;

  constructor(params: ProposedLinkParams) {
    this.id = `ProposedLink ${params.establishLinkRequest.linkId}`;
    this.consumer = params.establishLinkRequest.consumer;
    this.provider = params.establishLinkRequest.provider;
    this.paymentToken = params.establishLinkRequest.paymentToken;
    this.disputeMediator = params.establishLinkRequest.disputeMediator;
    this.threadAddress = params.establishLinkRequest.threadAddress;
    this.status = params.status;
    this.approveFunc = params.establishLinkRequest.approve;

    this.statusString = ko.pureComputed<string>(() => {
      const status = this.status();
      if (status === EProposedLinkStatus.Proposed) {
        return "Proposed";
      } else if (status === EProposedLinkStatus.Approved) {
        return "Approved";
      } else if (status === EProposedLinkStatus.Denied) {
        return "Denied";
      }
      return "Unknown";
    });

    this.approveButton = new ButtonParams("Approve", () => {
      this.approveFunc(true);
      this.status(EProposedLinkStatus.Approved);
      return null;
    });

    this.denyButton = new ButtonParams("Deny", () => {
      this.approveFunc(false);
      this.status(EProposedLinkStatus.Denied);
      return null;
    });

    this.showButtons = ko.pureComputed<boolean>(() => {
      if (this.status() === EProposedLinkStatus.Proposed) {
        return true;
      }
      return false;
    });
  }
}

ko.components.register("proposed-link", {
  viewModel: ProposedLinkViewModel,
  template: html,
});
