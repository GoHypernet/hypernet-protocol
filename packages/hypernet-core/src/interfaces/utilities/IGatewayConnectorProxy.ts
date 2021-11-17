import {
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISignedSendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  Balances,
  GatewayActivationError,
  GatewayConnectorError,
  GatewayUrl,
  GatewayValidationError,
  ProxyError,
  PublicIdentifier,
  Signature,
  PullPayment,
  PushPayment,
  IStateChannelRequest,
  UUID,
  GatewayTokenInfo,
  ActiveStateChannel,
  UtilityMessageSignature,
  PaymentId,
  SendFundsRequestData,
  AuthorizeFundsRequestData,
} from "@hypernetlabs/objects";
import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface IGatewayConnectorProxy extends ParentProxy {
  gatewayUrl: GatewayUrl;

  /**
   * activateProxy() sets up the gateway iframe and the communication
   * channel to the iframe. Nothing else is done
   */
  activateProxy(): ResultAsync<void, ProxyError>;

  /**
   * Returns true if the gateway connector is currently active.
   */
  getConnectorActivationStatus(): boolean;

  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, GatewayActivationError | ProxyError>;

  deauthorize(): ResultAsync<void, never>;

  /**
   * getValidatedSignature() requests the gateway iframe to return the
   * signature of the connector code, AFTER validating that the connector
   * code matches the signature.
   */
  getValidatedSignature(): ResultAsync<
    Signature,
    GatewayValidationError | ProxyError
  >;

  /**
   * Returns the GatewayTokenInfo list reported from the gateway connector
   */
  getGatewayTokenInfo(): ResultAsync<GatewayTokenInfo[], ProxyError>;

  closeGatewayIFrame(): ResultAsync<void, GatewayConnectorError | ProxyError>;

  displayGatewayIFrame(): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentDelayed(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPushPaymentCanceled(
    payment: PushPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentDelayed(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;
  notifyPullPaymentCanceled(
    payment: PullPayment,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, GatewayConnectorError | ProxyError>;

  messageSigned(
    message: string,
    signature: UtilityMessageSignature,
  ): ResultAsync<void, ProxyError>;

  sendFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, ProxyError>;

  authorizeFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, ProxyError>;

  returnStateChannel(
    id: UUID,
    stateChannel: ActiveStateChannel,
  ): ResultAsync<void, ProxyError>;

  // Signals to the outside world
  signMessageRequested: Observable<string>;

  initiateSendFundsRequested: Observable<SendFundsRequestData>;
  sendFundsRequested: Observable<ISignedSendFundsRequest>;

  initiateAuthorizeFundsRequested: Observable<AuthorizeFundsRequestData>;
  authorizeFundsRequested: Observable<ISignedAuthorizeFundsRequest>;

  resolveInsuranceRequested: Observable<IResolveInsuranceRequest>;
  stateChannelRequested: Observable<IStateChannelRequest>;
}
