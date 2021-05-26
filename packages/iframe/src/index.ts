import { CoreListener } from "@core-iframe/implementations/api";
import { CoreUIService } from "@core-iframe/implementations/business";
import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { IHypernetCore } from "@hypernetlabs/objects";
import { EBlockchainNetwork } from "@hypernetlabs/objects";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(
  EBlockchainNetwork.Localhost,
  undefined,
);

const coreUIService = new CoreUIService();

const coreListener = new CoreListener(core, coreUIService);
coreListener.activateModel();
