import { AjaxError } from "@hypernetlabs/objects";
import { AxiosRequestConfig } from "axios";
import { ResultAsync } from "neverthrow";

/**
 * AjaxUtils are just a wrapper around Axios for purposes of testing.
 */
export interface IAjaxUtils {
  get<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError>;
  post<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError>;
  put<T>(
    url: URL,
    data:
      | string
      | Record<string, unknown>
      | ArrayBuffer
      | ArrayBufferView
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError>;
  delete<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError>;
}

export interface IRequestConfig extends AxiosRequestConfig {}

export const IAjaxUtilsType = Symbol.for("IAjaxUtils");
