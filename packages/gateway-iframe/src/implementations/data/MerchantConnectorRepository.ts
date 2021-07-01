import {
  EthereumAddress,
  Signature,
  GatewayUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { IMerchantConnectorRepository } from "@gateway-iframe/interfaces/data";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

export class MerchantConnectorRepository
  implements IMerchantConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getMerchantSignature(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<Signature, AjaxError> {
    const url = this._prepareMerchantUrl(gatewayUrl, "signature");
    return this.ajaxUtils.get<Signature>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getMerchantAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<EthereumAddress, AjaxError> {
    const url = this._prepareMerchantUrl(gatewayUrl, "address");
    return this.ajaxUtils.get<EthereumAddress>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getMerchantCode(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<string, AjaxError> {
    const url = this._prepareMerchantUrl(gatewayUrl, "connector");
    return this.ajaxUtils.get<string>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  private _prepareMerchantUrl(gatewayUrl: GatewayUrl, path: string): URL {
    const merchantUrlObject = new URL(gatewayUrl);
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
