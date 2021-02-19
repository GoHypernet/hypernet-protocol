import { IHypernetCore, HypernetCore, EBlockchainNetwork, ExternalProvider } from "@hypernetlabs/hypernet-core";
import { ExternalProviderUtils } from "@hypernetlabs/utils";
import CoreWrapper from "./CoreWrapper";

declare global {
  interface Window {
    ethereum: any;
  }
}

let externalProvider: ExternalProvider;
if (true) {
  const externalProviderUtils = new ExternalProviderUtils();
  externalProvider = externalProviderUtils.getExternalProviderForDevelopment();
}

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost, undefined, externalProvider);

const coreWrapper = new CoreWrapper(core);
coreWrapper.activateModel();
