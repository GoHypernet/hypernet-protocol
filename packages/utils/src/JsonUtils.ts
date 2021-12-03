import { injectable } from "inversify";

import { IJsonUtils } from "@utils/IJsonUtils";

@injectable()
export class JsonUtils implements IJsonUtils {
  constructor() {}

  public safelyParseJSON<T>(json: string): T | null {
    try {
      return JSON.parse(json) as T | null;
    } catch (e) {
      return null;
    }
  }
}
