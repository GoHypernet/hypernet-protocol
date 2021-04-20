import { ILocalStorageUtils } from "@utils/ILocalStorageUtils";

export class LocalStorageUtils implements ILocalStorageUtils {
  public getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  public getSessionItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }

  public setSessionItem(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }
}
