import * as ko from "knockout";
import { PullPayment } from "@hypernetlabs/hypernet-core";
import html from "./PullPayment.template.html";
import moment from "moment";
import { PaymentStatusParams } from "../PaymentStatus/PaymentStatus.viewmodel";

export class PullPaymentParams {
  constructor(
    public payment: ko.Observable<PullPayment>,
  ) { }
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentViewModel {
  public id: string;
  public to: ko.PureComputed<string>;
  public from: ko.PureComputed<string>;
  public state: ko.PureComputed<PaymentStatusParams>;
  public paymentToken: ko.PureComputed<string>;
  public requiredStake: ko.PureComputed<string>;
  public amountStaked: ko.PureComputed<string>;
  public expirationDate: ko.PureComputed<string>;
  public finalized: ko.PureComputed<boolean>;
  public createdTimestamp: ko.PureComputed<string>;
  public updatedTimestamp: ko.PureComputed<string>;
  public collateralRecovered: ko.PureComputed<string>;
  public disputeMediator: ko.PureComputed<string>;
  public authorizedAmount: ko.PureComputed<string>;
  public transferedAmount: ko.PureComputed<string>;
  //public ledger: PullAmount[];

  protected payment: ko.Observable<PullPayment>;

  constructor(params: PullPaymentParams) {
    this.payment = params.payment;

    this.id = `Payment ${params.payment().id}`;

    this.to = ko.pureComputed(() => {
      return this.payment().to;
    });

    this.from = ko.pureComputed(() => {
      return this.payment().from;
    });

    this.state = ko.pureComputed<PaymentStatusParams>(() => {
      return new PaymentStatusParams(this.payment().state);
    });

    this.paymentToken = ko.pureComputed(() => {
      return this.payment().paymentToken;
    });

    this.requiredStake = ko.pureComputed(() => {
      return this.payment().requiredStake.toString();
    });

    this.amountStaked = ko.pureComputed(() => {
      return this.payment().amountStaked.toString();
    });

    this.expirationDate = ko.pureComputed(() => {
      const mdate = moment.unix(this.payment().expirationDate);

      return mdate.format();
    });

    this.finalized = ko.pureComputed(() => {
      return this.payment().finalized;
    });

    this.createdTimestamp = ko.pureComputed(() => {
      return this.payment().createdTimestamp.format();
    });

    this.updatedTimestamp = ko.pureComputed(() => {
      return this.payment().updatedTimestamp.format();
    });

    this.collateralRecovered = ko.pureComputed(() => {
      return this.payment().collateralRecovered.toString();
    });

    this.disputeMediator = ko.pureComputed(() => {
      return this.payment().disputeMediator;
    });
    
    this.authorizedAmount = ko.pureComputed(() => {
      return this.payment().authorizedAmount.toString();
    });

    this.transferedAmount = ko.pureComputed(() => {
      return this.payment().transferedAmount.toString();
    });
  }
}

ko.components.register("push-payment", {
  viewModel: PaymentViewModel,
  template: html,
});
