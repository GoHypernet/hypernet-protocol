import { Subject } from "rxjs";
import { IResolutionResult } from "./IResolutionResult";
import { PushPayment, PullPayment } from "@hypernetlabs/objects";

export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<IResolutionResult>;
  getAddress(): Promise<string>;

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  // Sends a request to display or hide the connector UI iframe
  onDisplayRequested: Subject<void>;

  // Sends a request to close the connector UI
  onCloseRequested: Subject<void>;

  // Send this to let the iframe know to prepare for imminent redirection
  onPreRedirect: Subject<IRedirectInfo>;

  // Called when the iframe is closed
  onIFrameClosed(): void;

  // Called when the iframe is displayed
  onIFrameDisplayed(): void;

  // Called for when a pull payment is sent, updated or recieved under your perview
  onPushPaymentSent(payment: PushPayment): void;
  onPushPaymentUpdated(payment: PushPayment): void;
  onPushPaymentReceived(payment: PushPayment): void;

  // Called for when a pull payment is sent, updated or recieved under your perview
  onPullPaymentSent(payment: PullPayment): void;
  onPullPaymentUpdated(payment: PullPayment): void;
  onPullPaymentReceived(payment: PullPayment): void;
}

export interface ISendFundsRequest {
  recipientPublicIdentifier: string;
  amount: string;
}

export interface IAuthorizeFundsRequest {
  recipientPublicIdentifier: string;
  total: string;
  expirationDate: number;
}

export interface IRedirectInfo {
  // This is a query string parameter that the iframe will look for
  redirectParam: string;

  // This is the value to expect
  redirectValue: string;

  // This callback will be called by the frame when it is ready for the redirect.
  readyFunction: () => void;
}
