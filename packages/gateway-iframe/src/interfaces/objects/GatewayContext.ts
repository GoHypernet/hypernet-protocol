import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import {
  GatewayValidationError,
  PublicIdentifier,
  Signature,
  GatewayUrl,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import Postmate from "postmate";
import { Subject } from "rxjs";

export class GatewayContext {
  constructor(
    public gatewayUrl: GatewayUrl,
    public onGatewayConnectorActivated: Subject<IGatewayConnector>,
    public onHypernetCoreProxyActivated: Subject<Postmate.ChildAPI>,
    public validatedGatewayCode: string | null,
    public validatedGatewaySignature: Signature | null,
    public gatewayConnector: IGatewayConnector | null,
    public publicIdentifier: PublicIdentifier | null,
    public gatewayValidated: ResultAsync<void, GatewayValidationError>,
  ) {}
}
