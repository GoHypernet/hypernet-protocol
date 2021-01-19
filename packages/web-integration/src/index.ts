export { default } from "./app";
export { IHypernetWebIntegration } from "./app/HypernetWebIntegration.interface";

import HypernetIFrameProxy from "./proxy/HypernetIFrameProxy";

const proxy = new HypernetIFrameProxy(null, "http://localhost:8090");

proxy.proxyReady().then(() => {
  proxy.initialize("asdfasd").map(() => {
    console.log("Initialize complete");
  });

  proxy.waitInitialized().map(() => {
    console.log("waitInitialized complete");
  });
});
