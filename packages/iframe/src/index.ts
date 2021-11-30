import { CoreListener } from "@core-iframe/implementations/api";
import { CoreUIService } from "@core-iframe/implementations/business";
import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { ChainId, IHypernetCore } from "@hypernetlabs/objects";
import { LogUtils, JsonUtils } from "@hypernetlabs/utils";
// Instantiate the hypernet core.

// Address and signature must be provided as params
const urlParams = new URLSearchParams(window.location.search);
const governanceChainId = urlParams.get("governanceChainId");
const debug = urlParams.get("debug");

const coreUIService = new CoreUIService();
const logUtils = new LogUtils();
const jsonUtils = new JsonUtils();

const core: IHypernetCore = new HypernetCore({
  governanceChainId: ChainId(Number(governanceChainId)) || undefined,
  debug: debug
    ? jsonUtils.safelyParseJSON<boolean>(debug) || undefined
    : undefined,
});

const coreListener = new CoreListener(core, coreUIService, logUtils);
coreListener.activateModel();
