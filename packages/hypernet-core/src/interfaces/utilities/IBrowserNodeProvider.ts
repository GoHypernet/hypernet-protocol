import { BrowserNode } from "@connext/vector-browser-node";
import { NodeError } from "@connext/vector-types";
import { ResultAsync } from "@interfaces/objects";

/**
 * IBrowserNodeProvider exists only to centralize the supply of
 * the Vector browser node. It wraps a global object, and simplifies
 * testing of it.
 */
export interface IBrowserNodeProvider {
  getBrowserNode(): ResultAsync<BrowserNode, NodeError | Error>;
}
