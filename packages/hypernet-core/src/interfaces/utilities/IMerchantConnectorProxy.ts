import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@hypernetlabs/objects/errors";
import { HexString } from "@hypernetlabs/objects";

export interface IMerchantConnectorProxy extends ParentProxy {
  /**
   * activateConnector() will actual cause the connector code to execute. This should only
   * be done if the user has authorized the connector.
   */
  activateConnector(): ResultAsync<void, MerchantConnectorError>;

  resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError>;

  getAddress(): ResultAsync<HexString, MerchantConnectorError>;

  getValidatedSignature(): ResultAsync<string, MerchantValidationError>;
}
