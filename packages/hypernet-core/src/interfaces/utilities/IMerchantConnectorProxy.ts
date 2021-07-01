import {
  IAuthorizeFundsRequest,
  IResolutionResult,
  ISendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  Balances,
  EthereumAddress,
  MerchantActivationError,
  MerchantConnectorError,
  GatewayUrl,
  MerchantValidationError,
  PaymentId,
  ProxyError,
  PublicIdentifier,
  Signature,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface IMerchantConnectorProxy extends ParentProxy {
  gatewayUrl: GatewayUrl;

  /**
   * activateProxy() sets up the merchant iframe and the communication
   * channel to the iframe. Not.hing else is done
   */
  activateProxy(): ResultAsync<void, ProxyError>;

  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, MerchantActivationError | ProxyError>;

  resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<IResolutionResult, MerchantConnectorError | ProxyError>;

  getAddress(): ResultAsync<
    EthereumAddress,
    MerchantConnectorError | ProxyError
  >;

  deauthorize(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  /**
   * getValidatedSignature() requests the merchant iframe to return the
   * signature of the connector code, AFTER validating that the connector
   * code matches the signature.
   */
  getValidatedSignature(): ResultAsync<
    Signature,
    MerchantValidationError | ProxyError
  >;

  closeMerchantIFrame(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  displayMerchantIFrame(): ResultAsync<
    void,
    MerchantConnectorError | ProxyError
  >;

  notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError | ProxyError>;

  messageSigned(
    message: string,
    signature: Signature,
  ): ResultAsync<void, ProxyError>;

  // Signals to the outside world
  signMessageRequested: Observable<string>;
  sendFundsRequested: Observable<ISendFundsRequest>;
  authorizeFundsRequested: Observable<IAuthorizeFundsRequest>;
}
