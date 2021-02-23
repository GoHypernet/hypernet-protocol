import { IHypernetCore, ResultAsync } from "@hypernetlabs/hypernet-core";
import { ParentProxy } from "packages/utils";

export default interface IHypernetIFrameProxy extends IHypernetCore, ParentProxy {
  proxyReady(): ResultAsync<void, Error>;
  startConnectorFlow(connector?: string): void;
}
