import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { MerchantValidationError, PublicIdentifier, Signature, MerchantUrl } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

export class MerchantContext {
  constructor(
    public merchantUrl: MerchantUrl,
    public onMerchantConnectorActivated: Subject<IMerchantConnector>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: Signature | null,
    public merchantConnector: IMerchantConnector | null,
    public publicIdentifier: PublicIdentifier | null,
    public merchantValidated: ResultAsync<void, MerchantValidationError>,
  ) {}
}
