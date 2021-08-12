import {
  IHypernetCore,
  GatewayUrl,
  IHypernetIFrameProxy,
} from "@hypernetlabs/objects";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

export interface IHypernetWebIntegration {
  core: IHypernetIFrameProxy;
  webUIClient: IHypernetWebUI;
  getReady: () => ResultAsync<IHypernetCore, Error>;
  displayGatewayIFrame(gatewayUrl: GatewayUrl): void;
  closeGatewayIFrame(gatewayUrl: GatewayUrl): void;
}
