import { Subject } from "rxjs";
export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<string>;
  getPublicKey(): Promise<string>;

  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;

  // Sends a request to display the connector
  onDisplayRequested: Subject<void>;
}

export interface ISendFundsRequest {}

export interface IAuthorizeFundsRequest {}
