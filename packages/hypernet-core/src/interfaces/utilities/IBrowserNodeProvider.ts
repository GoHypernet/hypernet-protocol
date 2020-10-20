import {BrowserNode} from "@connext/vector-browser-node";

export interface IBrowserNodeProvider {
    getBrowserNode(): Promise<BrowserNode>;
}