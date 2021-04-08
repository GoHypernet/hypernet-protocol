import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { EthereumAddress, MerchantConnectorError, MerchantValidationError, PaymentId, ProxyError, Signature } from "@hypernetlabs/objects";
import { PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorProxy extends ParentProxy {
  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  resolveChallenge(paymentId: PaymentId): ResultAsync<IResolutionResult, MerchantConnectorError | ProxyError>;

  getAddress(): ResultAsync<EthereumAddress, MerchantConnectorError | ProxyError>;

  getValidatedSignature(): ResultAsync<Signature, MerchantValidationError | ProxyError>;

  closeMerchantIFrame(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  displayMerchantIFrame(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  notifyPushPaymentSent(payment: PushPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPushPaymentUpdated(payment: PushPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPushPaymentReceived(payment: PushPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentSent(payment: PullPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentUpdated(payment: PullPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
  notifyPullPaymentReceived(payment: PullPayment): ResultAsync<void, MerchantConnectorError | ProxyError>;
}
