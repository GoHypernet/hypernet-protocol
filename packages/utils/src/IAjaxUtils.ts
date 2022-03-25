import { AjaxError, JsonWebToken } from "@hypernetlabs/objects";
import { AxiosRequestConfig } from "axios";
import { ResultAsync } from "neverthrow";
import stream from 'stream';

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
      | stream.Readable 
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
      | stream.Readable 
      | URLSearchParams,
    config?: IRequestConfig,
  ): ResultAsync<T, AjaxError>;
  delete<T>(url: URL, config?: IRequestConfig): ResultAsync<T, AjaxError>;
  setDefaultToken(token: JsonWebToken): void;
}

export interface IRequestConfig extends AxiosRequestConfig {}

export const IAjaxUtilsType = Symbol.for("IAjaxUtils");
