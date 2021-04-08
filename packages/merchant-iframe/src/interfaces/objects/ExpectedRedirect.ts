import { MerchantUrl } from "@hypernetlabs/objects";

export class ExpectedRedirect {
  constructor(public merchantUrl: MerchantUrl, public redirectParam: string, public paramValue: string) {}
}
