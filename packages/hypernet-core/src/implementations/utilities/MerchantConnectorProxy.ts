import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";
import { HexString, PublicKey } from "@interfaces/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";

export class MerchantConnectorProxy extends ParentProxy implements IMerchantConnectorProxy {
  constructor(element: HTMLElement | null, iframeUrl: string) {
    super(element, iframeUrl);
  }

  public activateConnector(): ResultAsync<void, MerchantConnectorError> {
    return this._createCall("activateConnector", null);
  }

  public resolveChallenge(paymentId: HexString): ResultAsync<IResolutionResult, MerchantConnectorError> {
    return this._createCall("resolveChallenge", paymentId);
  }

  public getPublicKey(): ResultAsync<PublicKey, MerchantConnectorError> {
    return this._createCall("getPublicKey", null);
  }

  public getValidatedSignature(): ResultAsync<string, MerchantValidationError> {
    return this._createCall("getValidatedSignature", null);
  }
}
