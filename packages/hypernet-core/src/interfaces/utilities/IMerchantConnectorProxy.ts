import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@hypernetlabs/objects/errors";
import { HexString, PullPayment, PushPayment } from "@hypernetlabs/objects";

export interface IMerchantConnectorProxy extends ParentProxy {
  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError>;

  getAddress(): ResultAsync<HexString, MerchantConnectorError>;

  getValidatedSignature(): ResultAsync<string, MerchantValidationError>;

  closeMerchantIFrame(): ResultAsync<void, MerchantConnectorError>;

  displayMerchantIFrame(): ResultAsync<void, MerchantConnectorError>;

  notifyPushPaymentSent(payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentUpdated(payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPushPaymentReceived(payment: PushPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentSent(payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentUpdated(payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
  notifyPullPaymentReceived(payment: PullPayment): ResultAsync<void, MerchantConnectorError>;
}
