import { Subject } from "rxjs";
import { IResolutionResult } from "./IResolutionResult";
export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<IResolutionResult>;
  getPublicKey(): Promise<string>;

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  // Sends a request to display or hide the connector UI iframe
  onDisplayRequested: Subject<string>;
  onCloseRequested: Subject<string>;  

  // Listen for iframe close or open events
  onIFrameClosed: Subject<string>;
  onIFrameDisplayed: Subject<string>;
}

export interface ISendFundsRequest {}

export interface IAuthorizeFundsRequest {}
