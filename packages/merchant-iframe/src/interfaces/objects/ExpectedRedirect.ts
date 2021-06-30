import { GatewayUrl } from "@hypernetlabs/objects";

export class ExpectedRedirect {
  constructor(
    public merchantUrl: GatewayUrl,
    public redirectParam: string,
    public paramValue: string,
  ) {}
}
