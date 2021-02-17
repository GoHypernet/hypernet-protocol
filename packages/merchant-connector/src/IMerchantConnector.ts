import { Subject } from "rxjs";
export interface IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<string>;
  getPublicKey(): Promise<string>;

  onPushFundsRequested: Subject<IPushFundsRequest>;
}

export interface IPushFundsRequest {}
