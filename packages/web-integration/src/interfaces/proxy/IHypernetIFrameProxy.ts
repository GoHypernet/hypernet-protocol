import { IHypernetCore } from "@hypernetlabs/hypernet-core";

export default interface IHypernetIFrameProxy extends IHypernetCore {
  proxyReady(): Promise<void>;
  startConnectorFlow(connector?: string): void;
}
