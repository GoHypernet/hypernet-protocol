import { ParentProxy } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";
import { IResolutionResult } from "@hypernetlabs/merchant-connector";
import { MerchantConnectorError, MerchantValidationError } from "@interfaces/objects/errors";
import { HexString, HypernetContext, PublicKey } from "@interfaces/objects";
import { IMerchantConnectorProxy } from "@interfaces/utilities";

export class MerchantConnectorProxy extends ParentProxy implements IMerchantConnectorProxy {
  constructor(element: HTMLElement | null, iframeUrl: string, context: HypernetContext) {
    super(element, iframeUrl);

    // Listen for iframe close event and pass it down to the child proxy.
    context.onMerchantIFrameClosed.subscribe(() => {
      this._createCall("onMerchantIFrameClosed", null);
    });
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
