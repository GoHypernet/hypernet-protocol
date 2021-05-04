import { MerchantUrl } from "@hypernetlabs/objects";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

import IHypernetIFrameProxy from "@web-integration/interfaces/proxy/IHypernetIFrameProxy";

export interface IHypernetWebIntegration {
  core: IHypernetIFrameProxy;
  webUIClient: IHypernetWebUI;
  getReady: () => ResultAsync<IHypernetIFrameProxy, Error>;
  displayMerchantIFrame(merchantUrl: MerchantUrl): void;
  closeMerchantIFrame(merchantUrl: MerchantUrl): void;
}
