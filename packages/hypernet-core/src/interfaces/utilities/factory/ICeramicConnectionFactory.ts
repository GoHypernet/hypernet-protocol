import { ResultAsync } from "neverthrow";

import { ICeramicUtils } from "@interfaces/utilities";

export interface ICeramicConnectionFactory {
  factoryCeramicConnection(): ResultAsync<ICeramicUtils, never>;
}

export const ICeramicConnectionFactoryType = Symbol.for(
  "ICeramicConnectionFactory",
);
