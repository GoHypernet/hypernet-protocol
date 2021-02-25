import { ILocalStorageUtils } from "@interfaces/utilities";

export class LocalStorageUtils implements ILocalStorageUtils {
  public getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }
}
