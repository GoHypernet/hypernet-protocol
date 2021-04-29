import { AjaxError } from "@hypernetlabs/objects";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IAjaxUtils, IRequestConfig } from "@utils/IAjaxUtils";

@injectable()
export class AxiosAjaxUtils implements IAjaxUtils {
  get<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.get(url.toString(), config),
      (e) => new AjaxError(`Unable to get ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
  post<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      axios.post(url.toString(), data, config),
      (e) => new AjaxError(`Unable to get ${url}`, e),
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
}
