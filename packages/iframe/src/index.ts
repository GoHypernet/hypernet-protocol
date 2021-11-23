import { CoreListener } from "@core-iframe/implementations/api";
import { CoreUIService } from "@core-iframe/implementations/business";
import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { IHypernetCore } from "@hypernetlabs/objects";
import { LogUtils } from "@hypernetlabs/utils";
// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore();
const coreUIService = new CoreUIService();
const logUtils = new LogUtils();

const coreListener = new CoreListener(core, coreUIService, logUtils);
coreListener.activateModel();
