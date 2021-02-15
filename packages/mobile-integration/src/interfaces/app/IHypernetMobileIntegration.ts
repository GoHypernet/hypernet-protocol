import { IHypernetCore } from "@hypernetlabs/hypernet-core";

export interface IHypernetMobileIntegration {
  getCoreReadyForWebView: () => Promise<IHypernetCore>;
}
