import {
  PushPayment,
  PullPayment,
  Balances,
  PublicIdentifier,
  GatewayTokenInfo,
} from "@hypernetlabs/objects";
import { Observable } from "rxjs";

import { IGetPaymentRequest } from "@gateway-connector/IGetPaymentRequest";
import { IInitiateAuthorizeFundsRequest } from "@gateway-connector/IInitiateAuthorizeFundsRequest";
import { IInitiateSendFundsRequest } from "@gateway-connector/IInitiateSendFundsRequest";
import { IResolveInsuranceRequest } from "@gateway-connector/IResolveInsuranceRequest";
import { ISignedAuthorizeFundsRequest } from "@gateway-connector/ISignedAuthorizeFundsRequest";
import { ISignedSendFundsRequest } from "@gateway-connector/ISignedSendFundsRequest";
import { ISignMessageRequest } from "@gateway-connector/ISignMessageRequest";
import { IStateChannelRequest } from "@gateway-connector/IStateChannelRequest";

export interface IGatewayConnector {
  /**
   * This is called when the gateway has been deauthorized by the user.
   * Once the returned promise is resolved, the gateway iframe/process
   * will be removed, OR after the deauthorization timeout has expired,
   * whichever comes first. This means that a Gateway Connector can do
   * things to clean up after deauthorization (like notify the gateway
   * service), but only has deauth timeout seconds to do it.
   * As soon as deauthorization is started, all XXXRequested requests
   * will no longer be honored, so the gateway cannot authorize or complete
   * and payments in response to deauthorize().
   */
  deauthorize(): Promise<void>;

  /**
   * This observable should emit when the connector wants to create a
   * push payment. The callback will be called with the prospective payment
   * ID. The gateway then needs to sign the whole request (via EIP-712),
   * return to the connector, and trigger sendFundsRequested
   */
  initiateSendFundsRequested: Observable<IInitiateSendFundsRequest>;

  /**
   * This observable should emit when the connector wants to create a
   * push payment. The callback will be called after the push payment
   * is initiated.
   */
  sendFundsRequested: Observable<ISignedSendFundsRequest>;

  /**
   * This observable should emit when the connector wants to create a
   * push payment. The callback will be called with the prospective payment
   * ID. The gateway then needs to sign the whole request (via EIP-712),
   * return to the connector, and trigger sendFundsRequested
   */
  initiateAuthorizeFundsRequested: Observable<IInitiateAuthorizeFundsRequest>;

  /**
   * This observable should emit when the connector wants to create a
   * pull payment. The callback will be called after the pull payment
   * is initiated.
   */
  authorizeFundsRequested: Observable<ISignedAuthorizeFundsRequest>;

  /**
   * This observable should emit when the connector wants to resolve
   * the insurance for a payment. This should happen after a payment is
   * accepted, and the gateway has determined if the payment is legitimate
   * or requires a dispute resolution. Since disputes are not a refund
   * mechanism, this can happen quite quickly after payment acceptance for
   * push payments.
   */
  resolveInsuranceRequested: Observable<IResolveInsuranceRequest>;

  /**
   * This observable should emit when the connector wants to ensure that a state
   * channel on a given chain for some set of routers exists. The request contains
   * the chain and the list of routers, as well as a callback method that will be
   * called with the channel address of a compatible state channel.
   */
  stateChannelRequested: Observable<IStateChannelRequest>;

  /**
   * Requests the current status of a payment.
   */
  getPaymentRequested: Observable<IGetPaymentRequest>;

  /**
   * This observable should emit when the connector wants to be displayed.
   */
  displayRequested: Observable<void>;

  /**
   * This observable should emit when the connector wants to be hidden.
   */
  closeRequested: Observable<void>;

  /**
   * Send this to request a signature from hypernet core on a message.
   * The answer will be provided via the callback.
   */
  signMessageRequested: Observable<ISignMessageRequest>;

  // Called when the iframe is closed
  onIFrameClosed(): void;

  // Called when the iframe is displayed
  onIFrameDisplayed(): void;

  // Called for when a pull payment is sent, updated or recieved under your perview
  onPushPaymentSent(payment: PushPayment): void;
  onPushPaymentUpdated(payment: PushPayment): void;
  onPushPaymentReceived(payment: PushPayment): void;
  onPushPaymentDelayed(payment: PushPayment): void;
  onPushPaymentCanceled(payment: PushPayment): void;

  // Called for when a pull payment is sent, updated or recieved under your perview
  onPullPaymentSent(payment: PullPayment): void;
  onPullPaymentUpdated(payment: PullPayment): void;
  onPullPaymentReceived(payment: PullPayment): void;
  onPullPaymentDelayed(payment: PullPayment): void;
  onPullPaymentCanceled(payment: PullPayment): void;

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

  /**
   * getGatewayTokenInfo() must return a promise of an array of GatewayTokenInfo objects.
   * HypernetProtocol can use this information to open state channels with routers
   * that are compatible with the gateway, before the gateway has requested a
   * particular channel. This allows a user to pre-load token into a channel before
   * it is needed.
   */
  getGatewayTokenInfo(): Promise<GatewayTokenInfo[]>;
}
