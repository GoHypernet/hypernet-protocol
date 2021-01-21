import ko from "knockout";
import { EPaymentState, IHypernetCore, PullPayment } from "@hypernetlabs/hypernet-core";
import html from "./PullPayment.template.html";
import moment from "moment";
import { PaymentStatusParams } from "../PaymentStatus/PaymentStatus.viewmodel";
import { ButtonParams } from "../Button/Button.viewmodel";

export class PullPaymentParams {
  constructor(public core: IHypernetCore, public payment: PullPayment) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PullPaymentViewModel {
  public id: string;
  public to: ko.Observable<string>;
  public from: ko.Observable<string>;
  public state: ko.Observable<PaymentStatusParams>;
  public paymentToken: ko.Observable<string>;
  public requiredStake: ko.Observable<string>;
  public amountStaked: ko.Observable<string>;
  public expirationDate: ko.Observable<string>;
  public finalized: ko.Observable<boolean>;
  public createdTimestamp: ko.Observable<string>;
  public updatedTimestamp: ko.Observable<string>;
  public collateralRecovered: ko.Observable<string>;
  public disputeMediator: ko.Observable<string>;
  public authorizedAmount: ko.Observable<string>;
  public transferedAmount: ko.Observable<string>;
  // public ledger: PullAmount[];
  public acceptButton: ButtonParams;
  public showAcceptButton: ko.PureComputed<boolean>;

  protected core: IHypernetCore;
  protected paymentId: string;

  constructor(params: PullPaymentParams) {
    this.core = params.core;

    this.id = `Payment ${params.payment.id}`;
    this.paymentId = params.payment.id;
    this.to = ko.observable(params.payment.to);
    this.from = ko.observable(params.payment.from);
    this.state = ko.observable(new PaymentStatusParams(params.payment.state));
    this.paymentToken = ko.observable(params.payment.paymentToken);
    this.requiredStake = ko.observable(params.payment.requiredStake.toString());
    this.amountStaked = ko.observable(params.payment.amountStaked.toString());
    const mdate = moment.unix(params.payment.expirationDate);
    this.expirationDate = ko.observable(mdate.format());
    this.finalized = ko.observable(params.payment.finalized);
    this.createdTimestamp = ko.observable(params.payment.createdTimestamp.format());
    this.updatedTimestamp = ko.observable(params.payment.updatedTimestamp.format());
    this.collateralRecovered = ko.observable(params.payment.collateralRecovered.toString());
    this.disputeMediator = ko.observable(params.payment.disputeMediator);
    this.authorizedAmount = ko.observable(params.payment.authorizedAmount.toString());
    this.transferedAmount = ko.observable(params.payment.transferedAmount.toString());

    this.core.onPushPaymentReceived.subscribe({
      next: (payment) => {
        if (payment.id === this.paymentId) {
          this.state(new PaymentStatusParams(params.payment.state));
        }
      },
    });

    this.core.onPullPaymentUpdated.subscribe({
      next: (payment) => {
        if (payment.id === this.paymentId) {
          this.state(new PaymentStatusParams(params.payment.state));
        }
      },
    });

    this.acceptButton = new ButtonParams("Accept", async () => {
      return await this.core.acceptFunds([this.paymentId]).map((results) => {
        const result = results[0];

        return result.match(
          (payment) => {
            this.state(new PaymentStatusParams(payment.state));
          },
          (e) => {
            // tslint:disable-next-line: no-console
            console.error(`Error getting payment with ID ${this.paymentId}: ${e}`);
          },
        );
      });
    });

    this.showAcceptButton = ko.pureComputed(() => {
      return this.state().state === EPaymentState.Proposed;
    });
  }
}

ko.components.register("pull-payment", {
  viewModel: PullPaymentViewModel,
  template: html,
});
