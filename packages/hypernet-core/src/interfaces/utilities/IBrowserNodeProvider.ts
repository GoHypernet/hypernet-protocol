import {BrowserNode} from "@connext/vector-browser-node";

export interface IBrowerNodeProvider {
    getBrowserNode(): Promise<BrowserNode>;
}