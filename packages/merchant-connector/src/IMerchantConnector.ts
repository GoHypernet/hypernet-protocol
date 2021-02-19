import { Subject } from "rxjs";
import { IResolutionResult } from "./IResolutionResult";
export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<IResolutionResult>;
  getPublicKey(): Promise<string>;

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  // Sends a request to display the connector
  onDisplayRequested: Subject<void>;
}

export interface ISendFundsRequest {}

export interface IAuthorizeFundsRequest {}
