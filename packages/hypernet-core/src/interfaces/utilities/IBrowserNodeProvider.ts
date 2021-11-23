import { BlockchainUnavailableError, VectorError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IBrowserNode } from "./IBrowserNode";

/**
 * IBrowserNodeProvider exists only to centralize the supply of
 * the Vector browser node. It wraps a global object, and simplifies
 * testing of it.
 */
export interface IBrowserNodeProvider {
  getBrowserNode(): ResultAsync<
    IBrowserNode,
    VectorError | BlockchainUnavailableError
  >;
}

export const IBrowserNodeProviderType = Symbol.for("IBrowserNodeProvider");
