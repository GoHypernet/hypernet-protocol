import { IMerchantConnector } from "@hypernetlabs/merchant-connector";
import { Subject } from "rxjs";

export class MerchantContext {
  constructor(
    public merchantUrl: string,
    public onMerchantConnectorActivated: Subject<IMerchantConnector>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: string | null,
    public merchantConnector: IMerchantConnector | null,
  ) {}
}
