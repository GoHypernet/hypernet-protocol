import { ResultAsync } from "neverthrow";

/**
 * AjaxUtils are just a wrapper around Axios for purposes of testing.
 */
export interface IAjaxUtils {
  get<T, E>(url: URL, config?: any): ResultAsync<T, E>;
  post<T, E>(url: URL, data: any, config?: any): ResultAsync<T, E>;
}
