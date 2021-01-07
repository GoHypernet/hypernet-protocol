import { mock, instance, verify, when } from "ts-mockito";
import { BrowserNodeProvider, ConfigProvider, ContextProvider, EthersBlockchainProvider, PaymentUtils } from "../src/implementations/utilities/index";
import { VectorUtils } from "../src/implementations/utilities/VectorUtils";
import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { Balances, BigNumber, ControlClaim, HypernetContext, InitializedHypernetContext } from "../src/interfaces/objects";
import { config, Subject } from "rxjs";
import { BrowserNode } from "@connext/vector-browser-node";
import { mkPublicIdentifier } from "@connext/vector-utils";
import randomstring from "randomstring";
import { Result } from "@connext/vector-types";
import * as Factory from "factory.ts";
import {NodeResponses} from "@connext/vector-types/src/schemas/node"

const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost);
let browserNodeProvider: BrowserNodeProvider;
let vectorutils: VectorUtils;

let contextProvider: ContextProvider;

const channelFactory = Factory.Sync.makeFactory<NodeResponses.GetChannelState>({
		assetIds: "asset1",
  		balances: "42",
	  	channelAddress: "test-channel",
		alice: "taddress",
		bob: "baddress",
		merkleRoot: "Byetes",
		nonce: 3,
		processedDepositsA: ["213123"],
		processedDepositsB: ["hello"],
		timeout: "400",
		aliceIdentifier: "saf",
		bobIdentifier: "wfff",
		latestUpdate: {},
		networkContext: {},
});


beforeEach(() => {
    contextProvider = mock(ContextProvider);
	const hypernetContext = mock(HypernetContext);
	const initializedHypernextContext = mock(InitializedHypernetContext);

	hypernetContext.account = "account";
	hypernetContext.publicIdentifier = "";
	when(hypernetContext.onControlClaimed).thenReturn(new Subject<ControlClaim>());

	const hypernetContextInstance = instance(hypernetContext);
	const initializedHypernetContextInstance = instance(initializedHypernextContext);
	when(contextProvider.getContext()).thenResolve(hypernetContextInstance);
	when(contextProvider.getInitializedContext()).thenResolve(initializedHypernetContextInstance);

	const browserNode = mock(BrowserNode);
	when(browserNode.getStateChannels()).thenResolve(Result.ok(["test-channel"]))
	// FIXME: can't make this work. always returns null.
	when(browserNode.getStateChannel({channelAddress: "test-channel"})).thenResolve(Result.ok(channelFactory.build({})));
	// when(browserNode.getRegisteredTransfers({chainId: 1})).thenResolve({})

	browserNodeProvider = mock(BrowserNodeProvider);
	when(browserNodeProvider.getBrowserNode()).thenResolve(instance(browserNode));

	vectorutils = new VectorUtils(configProvider, instance(contextProvider), instance(browserNodeProvider), {} as EthersBlockchainProvider);
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
