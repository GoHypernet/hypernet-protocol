import { IHypernetCore, HypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import { stringify } from "flatted";

declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost);
console.log("core instance: ", core);

if (window.ReactNativeWebView) {
  window.ReactNativeWebView.postMessage(stringify(core));
}
