import { ResultAsync } from "neverthrow";

import { ICeramicUtils } from "@interfaces/utilities";

export interface ICeramicUtilsFactory {
  factoryCeramicUtils(): ResultAsync<ICeramicUtils, never>;
}

export const ICeramicUtilsFactoryType = Symbol.for("ICeramicUtilsFactory");
