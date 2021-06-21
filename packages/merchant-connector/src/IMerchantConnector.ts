import {
  PushPayment,
  PullPayment,
  Balances,
  PublicIdentifier,
  EthereumAddress,
  PaymentId,
} from "@hypernetlabs/objects";
import { Observable } from "rxjs";

import { IAuthorizeFundsRequest } from "./IAuthorizeFundsRequest";
import { IRedirectInfo } from "./IRedirectInfo";
import { IResolutionResult } from "./IResolutionResult";
import { ISendFundsRequest } from "./ISendFundsRequest";
import { ISignMessageRequest } from "./ISignMessageRequest";

export interface IMerchantConnector {
  resolveChallenge(paymentId: PaymentId): Promise<IResolutionResult>;
  getAddress(): Promise<EthereumAddress>;

  /**
   * Deauthorize the merchant
   */
  deauthorize(): Promise<void>;

  /**
   * This observable should emit when the connector wants to create a
   * push payment. The callback will be called after the push payment
   * is initiated.
   */
  sendFundsRequested?: Observable<ISendFundsRequest>;

  /**
   * This observable should emit when the connector wants to create a
   * pull payment. The callback will be called after the pull payment
   * is initiated.
   */
  authorizeFundsRequested?: Observable<IAuthorizeFundsRequest>;

  /**
   * This observable should emit when the connector wants to be displayed.
   */
  displayRequested?: Observable<void>;

  /**
   * This observable should emit when the connector wants to be hidden.
   */
  closeRequested?: Observable<void>;

  /**
   * Send this to let the iframe know to prepare for imminent redirection
   */
  preRedirect?: Observable<IRedirectInfo>;

  /**
   * Send this to request a signature from hypernet core on a message.
   * The answer will be provided via the callback.
   */
  signMessageRequested?: Observable<ISignMessageRequest>;

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

  /**
   * This method will be called by the core when the public identifier is sent.
   * This occurs usually shortly after startup, and it should be stored by the
   * connector.
   * @param public_identifier
   */
  onPublicIdentifierReceived(public_identifier: PublicIdentifier): void;

  /**
   * This method is called by the core whenever the user's balances are updated.
   * This is provided shortly after startup and then any time the balances
   * change.
   * @param balances
   */
  onBalancesReceived(balances: Balances): void;
}
