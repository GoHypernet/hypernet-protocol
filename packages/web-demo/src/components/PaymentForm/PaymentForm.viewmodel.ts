import * as ko from "knockout";
import { EPaymentType, IHypernetCore } from "@hypernetlabs/hypernet-core";
import html from "./PaymentForm.template.html";
import { PushPaymentFormParams } from "../PushPaymentForm/PushPaymentForm.viewmodel";
import { PullPaymentFormParams } from "../PullPaymentForm/PullPaymentForm.viewmodel";
import { PublicIdentifier } from "@hypernetlabs/hypernet-core/lib/interfaces/objects";

export class PaymentFormParams {
  constructor(public core: IHypernetCore) {}
}

export class PaymentTypeOption {
  constructor(public typeName: string, public type: EPaymentType) {}
}

// tslint:disable-next-line: max-classes-per-file
export class PaymentFormViewModel {
  public remoteAccount: ko.Observable<string>;
  public paymentTypes: PaymentTypeOption[];
  public selectedPaymentType: ko.Observable<PaymentTypeOption | null>;
  public showPushForm: ko.PureComputed<boolean>;
  public showPullForm: ko.PureComputed<boolean>;
  public pushPayment: PushPaymentFormParams;
  public pullPayment: PullPaymentFormParams;

  protected core: IHypernetCore;

  constructor(params: PaymentFormParams) {
    this.core = params.core;

    this.remoteAccount = ko.observable("Enter public identifier");

    this.paymentTypes = [
      new PaymentTypeOption("Push", EPaymentType.Push),
      new PaymentTypeOption("Pull", EPaymentType.Pull),
    ];

    this.selectedPaymentType = ko.observable<PaymentTypeOption>(null);

    this.showPushForm = ko.pureComputed(() => {
      return this.selectedPaymentType()?.type === EPaymentType.Push;
    });

    this.showPullForm = ko.pureComputed(() => {
      return this.selectedPaymentType()?.type === EPaymentType.Pull;
    });

    this.pushPayment = new PushPaymentFormParams(this.core, this.remoteAccount);
    this.pullPayment = new PullPaymentFormParams(this.core);
  }
}

ko.components.register("payment-form", {
  viewModel: PaymentFormViewModel,
  template: html,
});
