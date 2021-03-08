import { Subject } from "rxjs";
import { IResolutionResult } from "./IResolutionResult";
export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<IResolutionResult>;
  getPublicKey(): Promise<string>;

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  // Sends a request to display or hide the connector UI iframe
  onDisplayRequested: Subject<string>;

  // Sends a request to close the connector UI
  onCloseRequested: Subject<string>;

  // Send this to let the iframe know to prepare for imminent redirection
  onPreRedirect: Subject<IRedirectInfo>;

  // Listen for iframe close event
  onIFrameClosed: Subject<string>;

  // Listen for the iframe displayed event
  onIFrameDisplayed: Subject<string>;
}

export interface ISendFundsRequest {}

export interface IAuthorizeFundsRequest {}

export interface IRedirectInfo {
  // This is a query string parameter that the iframe will look for
  redirectParam: string;

  // This is the value to expect
  redirectValue: string;

  // This callback will be called by the frame when it is ready for the redirect.
  readyFunction: () => void; 
}