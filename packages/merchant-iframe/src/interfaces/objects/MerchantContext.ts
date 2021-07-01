import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import {
  MerchantValidationError,
  PublicIdentifier,
  Signature,
  GatewayUrl,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { Subject } from "rxjs";

export class MerchantContext {
  constructor(
    public gatewayUrl: GatewayUrl,
    public onMerchantConnectorActivated: Subject<IGatewayConnector>,
    public onHypernetCoreProxyActivated: Subject<Postmate.ChildAPI>,
    public validatedMerchantCode: string | null,
    public validatedMerchantSignature: Signature | null,
    public merchantConnector: IGatewayConnector | null,
    public publicIdentifier: PublicIdentifier | null,
    public merchantValidated: ResultAsync<void, MerchantValidationError>,
  ) {}
}
