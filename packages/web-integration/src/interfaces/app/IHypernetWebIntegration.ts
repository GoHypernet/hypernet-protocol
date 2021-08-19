import { IHypernetCore, GatewayUrl, IUIData } from "@hypernetlabs/objects";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

export interface IHypernetWebIntegration {
  core: IHypernetCore;
  webUIClient: IHypernetWebUI;
  getReady: () => ResultAsync<IHypernetCore, Error>;
  displayGatewayIFrame(gatewayUrl: GatewayUrl): void;
  closeGatewayIFrame(gatewayUrl: GatewayUrl): void;
  UIData: IUIData;
}
