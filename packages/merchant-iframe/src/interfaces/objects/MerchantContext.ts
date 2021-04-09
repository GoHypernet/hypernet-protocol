import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { Subject } from "rxjs";
import {PublicIdentifier, Signature} from "@hypernetlabs/objects"

export class MerchantContext {
  constructor(
    public merchantUrl: string,
    public onMerchantConnectorActivated: Subject<IMerchantConnector>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: Signature | null,
    public merchantConnector: IMerchantConnector | null,
    public publicIdentifier: PublicIdentifier | null,
  ) {}
}
