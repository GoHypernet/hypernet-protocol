import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import {
  Balances,
  EthereumAddress,
  MerchantConnectorError,
  MerchantValidationError,
  InvalidParametersError,
  PaymentId,
  ProxyError,
  PublicIdentifier,
  Signature,
} from "@hypernetlabs/objects";
import { PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorProxy extends ParentProxy {
  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;

  resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<IResolutionResult, MerchantConnectorError | ProxyError | InvalidParametersError>;

  getAddress(): ResultAsync<EthereumAddress, MerchantConnectorError | ProxyError>;

  getValidatedSignature(): ResultAsync<Signature, MerchantValidationError | ProxyError>;

  closeMerchantIFrame(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  displayMerchantIFrame(): ResultAsync<void, MerchantConnectorError | ProxyError>;

  notifyPushPaymentSent(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyPushPaymentUpdated(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyPushPaymentReceived(
    payment: PushPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyPullPaymentSent(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyPullPaymentUpdated(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyPullPaymentReceived(
    payment: PullPayment,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
  notifyBalancesReceived(
    balances: Balances,
  ): ResultAsync<void, MerchantConnectorError | ProxyError | InvalidParametersError>;
}
