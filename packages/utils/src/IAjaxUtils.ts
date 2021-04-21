import { AxiosRequestConfig } from "axios";
import { ResultAsync } from "neverthrow";

/**
 * AjaxUtils are just a wrapper around Axios for purposes of testing.
 */
export interface IAjaxUtils {
  get<T, E>(url: URL, config?: IRequestConfig): ResultAsync<T, E>;
  post<T, E>(
    url: URL,
    data: string | object | ArrayBuffer | ArrayBufferView | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, E>;
}

export type IRequestConfig = AxiosRequestConfig;
