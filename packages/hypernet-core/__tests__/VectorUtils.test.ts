import { ConfigProvider, EthersBlockchainProvider } from "../src/implementations/utilities/index";

import {getContextProvidor, BrowserNodeProvider} from "./utils"
import { VectorUtils } from "../src/implementations/utilities/VectorUtils";
import { EBlockchainNetwork } from "../src/interfaces/types";

const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost);
const contextProvider = getContextProvidor();
const browserNodeProvider = new BrowserNodeProvider();
const vectorutils = new VectorUtils(configProvider, contextProvider, browserNodeProvider, {} as EthersBlockchainProvider)

test("Test vectorutils", async () => {
	const channelAddress = await vectorutils.getRouterChannelAddress();

});
