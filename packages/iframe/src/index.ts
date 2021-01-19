import { IHypernetCore, HypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";
import CoreWrapper from "./CoreWrapper";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost);

const coreWrapper = new CoreWrapper(core);

// Load connectors
