import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { Subject } from "rxjs";
import { MerchantValidationError, PublicIdentifier, Signature } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export class MerchantContext {
  constructor(
    public merchantUrl: string,
    public onMerchantConnectorActivated: Subject<IMerchantConnector>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: Signature | null,
    public merchantConnector: IMerchantConnector | null,
    public publicIdentifier: PublicIdentifier | null,
    public merchantValidated: ResultAsync<void, MerchantValidationError>,
  ) { }
}
