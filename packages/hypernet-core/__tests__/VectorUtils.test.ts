import { BrowserNodeProvider, ConfigProvider, ContextProvider, EthersBlockchainProvider, LogUtils, PaymentUtils } from "../src/implementations/utilities/index";
import { VectorUtils } from "../src/implementations/utilities/VectorUtils";
import { EBlockchainNetwork, EPaymentType } from "../src/interfaces/types";
import { Balances, BigNumber, ControlClaim, HypernetContext, InitializedHypernetContext, PullPayment, PushPayment } from "../src/interfaces/objects";
import { Subject } from "rxjs";
import { ok } from "neverthrow";
import { PaymentIdUtils } from "../src/implementations/utilities/PaymentIdUtils";
import randomstring from "randomstring";
import { mkPublicIdentifier } from "@connext/vector-utils";

const logUtils = new LogUtils();
const paymentIdUtils = new PaymentIdUtils();
const configProvider = new ConfigProvider(EBlockchainNetwork.Localhost, logUtils);
let browserNodeProvider: BrowserNodeProvider;
let vectorutils: VectorUtils;

const hypernetContext = new HypernetContext("account", "publicId", false, new Subject<ControlClaim>(), new Subject<ControlClaim>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<Balances>())
const contextProvider = new ContextProvider(new Subject<ControlClaim>(), new Subject<ControlClaim>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<PushPayment>(), new Subject<PullPayment>(), new Subject<Balances>());

beforeEach(async () => {
  contextProvider.setContext(hypernetContext);
	hypernetContext.account = "test-account";
	hypernetContext.publicIdentifier = mkPublicIdentifier();

	browserNodeProvider = new BrowserNodeProvider(configProvider, contextProvider, logUtils);
	vectorutils = new VectorUtils(configProvider, contextProvider, browserNodeProvider, {} as EthersBlockchainProvider, paymentIdUtils, logUtils);
})

test("Test configProvider", async () => {
	expect(await configProvider.getConfig()).toEqual(ok({
       "chainId": 1337,
        "chainProviders": {
          "1337": "http://localhost:8545",
        },
       "defaultPaymentExpiryLength": 432000,
       "hypernetProtocolDomain": "Hypernet",
       "hypertokenAddress": "0x0000000000000000000000000000000000000000",
       "iframeSource": "http://localhost:5000",
       "routerMnemonic": "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
       "routerPublicIdentifier": "vector8AXWmo3dFpK1drnjeWPyi9KTy9Fy3SkCydWx8waQrxhnW4KPmR",
       "routerUrl": "localhost:8008",
     }));
  });

  test("vector utils", async () => {
  const validId = "0x" + randomstring.generate({length: 64, charset: 'hex'});
  const res = await vectorutils.createPaymentTransfer(EPaymentType.Push, mkPublicIdentifier(), BigNumber.from("42"), "assetAddress",  validId, new Date().toISOString(), new Date().toISOString())
  console.dir(res)
	expect(await vectorutils.createPaymentTransfer(EPaymentType.Push, mkPublicIdentifier(), BigNumber.from("42"), "assetAddress",  validId, new Date().toISOString(), new Date().toISOString())).toEqual("as")
  })
