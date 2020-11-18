import {BrowserNode} from "@connext/vector-browser-node";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface IBrowserNodeProvider {
    getBrowserNode(): Promise<BrowserNode>;
}