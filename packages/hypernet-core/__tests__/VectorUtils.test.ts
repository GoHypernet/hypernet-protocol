import { BrowserNodeProvider, ConfigProvider, ContextProvider, EthersBlockchainProvider, PaymentUtils } from "../src/implementations/utilities/index";
import { VectorUtils } from "../src/implementations/utilities/VectorUtils";
import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { Balances, BigNumber, ControlClaim, HypernetContext, InitializedHypernetContext, PullPayment, PushPayment } from "../src/interfaces/objects";
import { config, Subject } from "rxjs";
import { mkPublicIdentifier } from "@connext/vector-utils";
import randomstring from "randomstring";

import {NodeResponses} from "@connext/vector-types/src/schemas/node"

const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost);
let browserNodeProvider: BrowserNodeProvider;
let vectorutils: VectorUtils;

let contextProvider: ContextProvider;



beforeEach(async () => {
		contextProvider = new ContextProvider(new Subject<ControlClaim>(), new Subject<ControlClaim>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<Balances>());
		const hypernetContext = await contextProvider.getContext();
		hypernetContext.account = "";
		hypernetContext.publicIdentifier = mkPublicIdentifier();

	browserNodeProvider = new BrowserNodeProvider(configProvider, contextProvider);
	vectorutils = new VectorUtils(configProvider, contextProvider, browserNodeProvider, {} as EthersBlockchainProvider);
})

test("Test configProvider", async () => {
	expect(await configProvider.getConfig()).toEqual({
       "chainId": 1337,
       "defaultPaymentExpiryLength": 432000,
       "hypernetProtocolDomain": "Hypernet",
       "hypertokenAddress": "0x0000000000000000000000000000000000000000",
       "iframeSource": "http://localhost:5000",
       "routerMnemonic": "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
       "routerPublicIdentifier": "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR",
       "routerUrl": "localhost:8008",
     });
  });

  test("vector utils", async () => {
	const validId = "0x" + randomstring.generate({length: 64, charset: 'hex'});
	expect(await vectorutils.createPaymentTransfer(EPaymentType.Pull, mkPublicIdentifier(), BigNumber.from("42"), "assetAddress",  validId, new Date().toISOString(), new Date().toISOString())).toEqual("as")
  })
