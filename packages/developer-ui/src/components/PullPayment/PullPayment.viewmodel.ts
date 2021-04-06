import ko from "knockout";
import { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { PaymentId, PullPayment } from "@hypernetlabs/objects";
import { EPaymentState } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import html from "./PullPayment.template.html";
import moment from "moment";
import { PaymentStatusParams } from "../PaymentStatus/PaymentStatus.viewmodel";
import { ButtonParams } from "../Button/Button.viewmodel";

export class PullPaymentParams {
  constructor(public integration: IHypernetWebIntegration, public payment: PullPayment) {}
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
  public createdTimestamp: ko.Observable<string>;
  public updatedTimestamp: ko.Observable<string>;
  public collateralRecovered: ko.Observable<string>;
  public merchantUrl: ko.Observable<string>;
  public authorizedAmount: ko.Observable<string>;
  public transferedAmount: ko.Observable<string>;
  public deltaAmount: ko.Observable<string>;
  public deltaTime: ko.Observable<number>;

  // public ledger: PullAmount[];
  public acceptButton: ButtonParams;
  public showAcceptButton: ko.PureComputed<boolean>;
  public pullButton: ButtonParams;
  public showPullButton: ko.PureComputed<boolean>;
  public disputeButton: ButtonParams;
  public showDisputeButton: ko.PureComputed<boolean>;

  protected integration: IHypernetWebIntegration;
  protected paymentId: PaymentId;
  protected publicIdentifier: ko.Observable<string | null>;

  constructor(params: PullPaymentParams) {
    this.integration = params.integration;

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
    this.createdTimestamp = ko.observable(params.payment.createdTimestamp.toString());
    this.updatedTimestamp = ko.observable(params.payment.updatedTimestamp.toString());
    this.collateralRecovered = ko.observable(params.payment.collateralRecovered.toString());
    this.merchantUrl = ko.observable(params.payment.merchantUrl);
    this.authorizedAmount = ko.observable(params.payment.authorizedAmount.toString());
    this.transferedAmount = ko.observable(params.payment.amountTransferred.toString());
    this.deltaAmount = ko.observable(params.payment.deltaAmount.toString());
    this.deltaTime = ko.observable(params.payment.deltaTime);

    this.integration.core.onPushPaymentReceived.subscribe({
      next: (payment) => {
        if (payment.id === this.paymentId) {
          this.state(new PaymentStatusParams(params.payment.state));
        }
      },
    });

    this.integration.core.onPullPaymentUpdated.subscribe({
      next: (payment) => {
        if (payment.id === this.paymentId) {
          this.state(new PaymentStatusParams(payment.state));
        }
      },
    });

    this.acceptButton = new ButtonParams("Accept", async () => {
      return await this.integration.core.acceptOffers([this.paymentId]).map((results) => {
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

    this.pullButton = new ButtonParams("Pull", async () => {
      return await this.integration.core.pullFunds(this.paymentId, BigNumber.from(1)).mapErr((e) => {
        alert("Unable to pull funds!");
        console.error(e);
      });
    });

    this.showPullButton = ko.pureComputed(() => {
      const state = this.state();
      return state.state === EPaymentState.Approved && this.publicIdentifier() == this.to();
    });

    this.disputeButton = new ButtonParams("Dispute", async () => {
      return await this.integration.core.initiateDispute(this.paymentId).mapErr((e) => {
        alert("Error during dispute!");
        console.error(e);
      });
    });

    this.showDisputeButton = ko.pureComputed(() => {
      return this.state().state === EPaymentState.Accepted && this.publicIdentifier() === this.from();
    });

    this.publicIdentifier = ko.observable(null);
    this.integration.core.getPublicIdentifier().map((pi) => {
      this.publicIdentifier(pi);
    });
  }
}

ko.components.register("pull-payment", {
  viewModel: PullPaymentViewModel,
  template: html,
});
