import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { IHypernetCore } from "@hypernetlabs/objects";
import { EBlockchainNetwork } from "@hypernetlabs/objects";

import CoreWrapper from "./CoreWrapper";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost, undefined);

const coreWrapper = new CoreWrapper(core);
coreWrapper.activateModel();
