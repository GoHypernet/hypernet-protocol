import { BrowserNode } from "@connext/vector-browser-node";

/**
 * IBrowserNodeProvider exists only to centralize the supply of
 * the Vector browser node. It wraps a global object, and simplifies
 * testing of it.
 */
export interface IBrowserNodeProvider {
  getBrowserNode(): Promise<BrowserNode>;
}
