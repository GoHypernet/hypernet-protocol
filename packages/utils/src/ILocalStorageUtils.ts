export interface ILocalStorageUtils {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  getSessionItem(key: string): string | null;
  setSessionItem(key: string, value: string): void;
  removeSessionItem(key: string): void;
}

export const ILocalStorageUtilsType = Symbol.for("ILocalStorageUtils");
