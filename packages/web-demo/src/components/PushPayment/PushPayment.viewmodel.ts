import * as ko from "knockout";
import { EPaymentState, IHypernetCore, PushPayment } from "@hypernetlabs/hypernet-core";
import html from "./PushPayment.template.html";
import moment from "moment";
import { PaymentStatusParams } from "../PaymentStatus/PaymentStatus.viewmodel";
import { ButtonParams } from "../Button/Button.viewmodel";

export class PushPaymentParams {
  constructor(public core: IHypernetCore, public payment: PushPayment) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PushPaymentViewModel {
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
  public paymentAmount: ko.Observable<string>;
  public acceptButton: ButtonParams;
  public showAcceptButton: ko.PureComputed<boolean>;

  protected core: IHypernetCore;
  protected paymentId: string;

  constructor(params: PushPaymentParams) {
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
    this.paymentAmount = ko.observable(params.payment.paymentAmount.toString());

    this.core.onPushPaymentReceived.subscribe({
      next: (payment) => {
        if (payment.id === this.paymentId) {
          this.state(new PaymentStatusParams(params.payment.state));
        }
      },
    });

    this.acceptButton = new ButtonParams("Accept", async () => {
      const payments = await this.core.acceptFunds([this.paymentId]);
      const payment = payments[0];
      if (payment.isError) {
        throw new Error("Error getting payment.");
      }
      this.state(new PaymentStatusParams(payment.getValue().state));
    });

    this.showAcceptButton = ko.pureComputed(() => {
      return this.state().state === EPaymentState.Proposed;
    });
  }
}

ko.components.register("push-payment", {
  viewModel: PushPaymentViewModel,
  template: html,
});
