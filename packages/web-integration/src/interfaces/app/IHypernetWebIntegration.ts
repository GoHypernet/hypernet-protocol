import { IHypernetCore, MerchantUrl } from "@hypernetlabs/objects";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

export interface IHypernetWebIntegration {
  core: IHypernetCore;
  webUIClient: IHypernetWebUI;
  getReady: () => ResultAsync<IHypernetCore, Error>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): void;
  closeMerchantIFrame(merchantUrl: MerchantUrl): void;
}
