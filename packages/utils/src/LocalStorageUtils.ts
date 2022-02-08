import { injectable } from "inversify";

import { ILocalStorageUtils } from "@utils/ILocalStorageUtils";

@injectable()
export class LocalStorageUtils implements ILocalStorageUtils {
  public getItem(key: string): string | null {
    const itemValue = window.localStorage.getItem(key);
    return itemValue === "null" ? null : itemValue;
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  public removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  public getSessionItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }

  public setSessionItem(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }

  public removeSessionItem(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}
