import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoin } from 'url-join-ts';

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getMerchantSignature(merchantUrl: string): ResultAsync<string, Error> {
    const url = new URL(urlJoin(merchantUrl, "signature"));
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantAddress(merchantUrl: string): ResultAsync<string, Error> {
    const url = new URL(urlJoin(merchantUrl, "address"));
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getMerchantCode(merchantUrl: string): ResultAsync<string, Error> {
    const url = new URL(urlJoin(merchantUrl, "connector"));
    return this.ajaxUtils.get<string, Error>(url).andThen((response) => {
      return okAsync(response);
    });
  }
}
