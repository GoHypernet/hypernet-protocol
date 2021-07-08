import {
  EthereumAddress,
  Signature,
  GatewayUrl,
  AjaxError,
} from "@hypernetlabs/objects";
import { IAjaxUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP } from "url-join-ts";

import { IGatewayConnectorRepository } from "@gateway-iframe/interfaces/data";

export class GatewayConnectorRepository implements IGatewayConnectorRepository {
  constructor(protected ajaxUtils: IAjaxUtils) {}

  public getGatewaySignature(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<Signature, AjaxError> {
    const url = this._prepareGatewayUrl(gatewayUrl, "signature");
    return this.ajaxUtils.get<Signature>(url).andThen((response) => {
      return okAsync(response);
    });
  }
  public getGatewayAddress(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<EthereumAddress, AjaxError> {
    const url = this._prepareGatewayUrl(gatewayUrl, "address");
    return this.ajaxUtils.get<EthereumAddress>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  public getGatewayCode(
    gatewayUrl: GatewayUrl,
  ): ResultAsync<string, AjaxError> {
    const url = this._prepareGatewayUrl(gatewayUrl, "connector");
    return this.ajaxUtils.get<string>(url).andThen((response) => {
      return okAsync(response);
    });
  }

  private _prepareGatewayUrl(gatewayUrl: GatewayUrl, path: string): URL {
    const gatewayUrlObject = new URL(gatewayUrl);
    const searchParams = {};
    for (const [key, value] of new URLSearchParams(
      gatewayUrlObject.search,
    ).entries()) {
      searchParams[key] = value;
    }
    gatewayUrlObject.search = "";
    return new URL(urlJoinP(gatewayUrlObject.toString(), [path], searchParams));
  }
}
