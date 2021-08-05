import { ResultAsync } from "neverthrow";

import { IBrowserNode } from "@interfaces/utilities";

export interface IBrowserNodeFactory {
  factoryBrowserNode(): ResultAsync<IBrowserNode, never>;
}

export const IBrowserNodeFactoryType = Symbol.for("IBrowserNodeFactory");
