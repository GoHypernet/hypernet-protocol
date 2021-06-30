import { IHypernetCore, GatewayUrl } from "@hypernetlabs/objects";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

export interface IHypernetWebIntegration {
  core: IHypernetCore;
  webUIClient: IHypernetWebUI;
  getReady: () => ResultAsync<IHypernetCore, Error>;
  displayMerchantIFrame(gatewayUrl: GatewayUrl): void;
  closeMerchantIFrame(gatewayUrl: GatewayUrl): void;
}
