import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { ExternalProviderUtils } from "@hypernetlabs/utils";
import { ExternalProvider, IHypernetCore } from "@hypernetlabs/objects";
import { EBlockchainNetwork } from "@hypernetlabs/objects/types";
import CoreWrapper from "./CoreWrapper";

declare global {
  interface Window {
    ethereum: any;
  }
}

let externalProvider: ExternalProvider | undefined;
if (!window?.ethereum) {
  const externalProviderUtils = new ExternalProviderUtils();
  externalProvider = externalProviderUtils.getExternalProviderForDevelopment();
}

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost, undefined, externalProvider);

const coreWrapper = new CoreWrapper(core);
coreWrapper.activateModel();
