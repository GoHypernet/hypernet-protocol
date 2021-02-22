import { IHypernetCore } from "@hypernetlabs/hypernet-core";
import { ParentProxy } from "packages/utils";

export default interface IHypernetIFrameProxy extends IHypernetCore, ParentProxy {
  proxyReady(): Promise<void>;
  startConnectorFlow(connector?: string): void;
}
