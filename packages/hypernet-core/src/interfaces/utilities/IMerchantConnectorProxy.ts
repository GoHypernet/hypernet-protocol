import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";
import { HexString, PublicKey } from "@interfaces/objects";

export interface IMerchantConnectorProxy extends ParentProxy {
  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError>;

  getPublicKey(): ResultAsync<PublicKey, MerchantConnectorError>;

  getValidatedSignature(): ResultAsync<string, MerchantValidationError>;

  activateProxy(): ResultAsync<void, MerchantValidationError>;
}
