import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { PublicKey } from "@hypernetlabs/hypernet-core";
import { okAsync, ResultAsync } from "neverthrow";

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getMerchantSignature(merchantUrl: URL): ResultAsync<string, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "signature";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantPublicKey(merchantUrl: URL): ResultAsync<PublicKey, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "publicKey";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getMerchantCode(merchantUrl: URL): ResultAsync<string, Error> {
    const url = new URL(merchantUrl.toString());
    url.pathname = "connector";
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
}
