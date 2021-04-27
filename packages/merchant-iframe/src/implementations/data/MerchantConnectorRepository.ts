import { EthereumAddress, Signature, MerchantUrl, AjaxError } from "@hypernetlabs/objects";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";

export class MerchantConnectorRepository
  implements IMerchantConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getMerchantSignature(merchantUrl: MerchantUrl): ResultAsync<Signature, AjaxError> {
    const url = this._prepareMerchantUrl(merchantUrl, "signature");
    return this.ajaxUtils.get<Signature>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantAddress(merchantUrl: MerchantUrl): ResultAsync<EthereumAddress, AjaxError> {
    const url = this._prepareMerchantUrl(merchantUrl, "address");
    return this.ajaxUtils.get<EthereumAddress>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getMerchantCode(merchantUrl: MerchantUrl): ResultAsync<string, AjaxError> {
    const url = this._prepareMerchantUrl(merchantUrl, "connector");
    return this.ajaxUtils.get<string>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  private _prepareMerchantUrl(merchantUrl: MerchantUrl, path: string): URL {
    const merchantUrlObject = new URL(merchantUrl);
    const searchParams = {};
    for (const [key, value] of new URLSearchParams(
      merchantUrlObject.search,
    ).entries()) {
      searchParams[key] = value;
    }
    merchantUrlObject.search = "";
    return new URL(
      urlJoinP(merchantUrlObject.toString(), [path], searchParams),
    );
  }
}
