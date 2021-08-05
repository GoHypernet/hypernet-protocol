import { GatewayUrl } from "@hypernetlabs/objects";

export class ExpectedRedirect {
  constructor(
    public gatewayUrl: GatewayUrl,
    public redirectParam: string,
    public paramValue: string,
  ) {}
}
