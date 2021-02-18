import { IAuthorizeFundsRequest, IMerchantConnector, ISendFundsRequest } from "@hypernetlabs/merchant-connector";
import { Subject } from "rxjs";

declare global {
  interface Window {
    connector: IMerchantConnector;
  }
}

class TestMerchantConnector implements IMerchantConnector {
  resolveChallenge(paymentId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getPublicKey(): Promise<string> {
    return Promise.resolve(
      "0x046655feed4d214c261e0a6b554395596f1f1476a77d999560e5a8df9b8a1a3515217e88dd05e938efdd71b2cce322bf01da96cd42087b236e8f5043157a9c068e",
    );
  }
  onSendFundsRequested: Subject<ISendFundsRequest>;
  onAuthorizeFundsRequested: Subject<IAuthorizeFundsRequest>;
  onDisplayRequested: Subject<void>;

  constructor() {
    this.onSendFundsRequested = new Subject<ISendFundsRequest>();
    this.onAuthorizeFundsRequested = new Subject<IAuthorizeFundsRequest>();
    this.onDisplayRequested = new Subject<void>();
  }
}

window.connector = new TestMerchantConnector();
