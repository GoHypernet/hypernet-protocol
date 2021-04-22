import axios, { AxiosResponse } from "axios";
import { ResultAsync } from "neverthrow";

import { IAjaxUtils, IRequestConfig } from "@utils/IAjaxUtils";

export class AxiosAjaxUtils implements IAjaxUtils {
  get<T, E>(url: URL, config?: IRequestConfig): ResultAsync<T, E> {
    return ResultAsync.fromPromise(
      axios.get(url.toString(), config),
      (e) => e as E,
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
  post<T, E>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, E> {
    return ResultAsync.fromPromise(
      axios.post(url.toString(), data, config),
      (e) => e as E,
    ).map((response: AxiosResponse<T>) => {
      return response.data;
    });
  }
}
