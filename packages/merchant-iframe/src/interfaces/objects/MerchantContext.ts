import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { MerchantUrl, Signature, PublicIdentifier } from "@hypernetlabs/objects";
import { Subject } from "rxjs";

export class MerchantContext {
  constructor(
    public merchantUrl: MerchantUrl,
    public onMerchantConnectorActivated: Subject<IMerchantConnector>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: Signature | null,
    public merchantConnector: IMerchantConnector | null,
    public publicIdentifier: PublicIdentifier | null,
  ) {}
}
