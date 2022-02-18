import { CoreListener } from "@core-iframe/implementations/api";
import { CoreUIService } from "@core-iframe/implementations/business";
import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { ChainId, IHypernetCore } from "@hypernetlabs/objects";
import { LogUtils, JsonUtils, LocalStorageUtils } from "@hypernetlabs/utils";
// Instantiate the hypernet core.

const urlParams = new URLSearchParams(window.location.search);
const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
const debug = urlParams.get("debug");

const coreUIService = new CoreUIService();
const logUtils = new LogUtils();
const jsonUtils = new JsonUtils();
const localStorageUtils = new LocalStorageUtils();

const governanceChainId = localStorageUtils.getItem("governanceChainId");

const debugParsed = jsonUtils.safelyParseJSON<boolean>(debug as string);

const chainId = governanceChainId || defaultGovernanceChainId;

const core: IHypernetCore = new HypernetCore({
  defaultGovernanceChainId: ChainId(Number(chainId)) || undefined,
  debug: debugParsed == null ? undefined : debugParsed,
});

const coreListener = new CoreListener(
  core,
  coreUIService,
  logUtils,
  ChainId(Number(chainId)),
);
coreListener.activateModel();
