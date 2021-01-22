import { okAsync } from "neverthrow";
import {
  Balances,
  HypernetConfig,
  InitializedHypernetContext,
  ControlClaim,
  PushPayment,
  PullPayment,
} from "@interfaces/objects";
import { NodeResponses } from "@connext/vector-types";
import { Result } from "@connext/vector-types";
import {
  IBlockchainProvider,
  IBrowserNode,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IFullChannelState,
  ILogUtils,
  IPaymentIdUtils,
} from "@interfaces/utilities";
import { mock, when } from "ts-mockito";
import { VectorUtils } from "@implementations/utilities/VectorUtils";
import { Subject } from "rxjs";
import { resolvableInstance } from "../../mock/utils/resolvableInstance";

class VectorUtilsMocks {
  public configProvider: IConfigProvider = mock<IConfigProvider>();
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public browserNodeProvider: IBrowserNodeProvider = mock<IBrowserNodeProvider>();
  public blockchainProvider: IBlockchainProvider = mock<IBlockchainProvider>();
  public paymentIdUtils: IPaymentIdUtils = mock<IPaymentIdUtils>();
  public logUtils: ILogUtils = mock<ILogUtils>();

  public browserNode: IBrowserNode = mock<IBrowserNode>();
  public config: HypernetConfig;
  public context: InitializedHypernetContext;

  public onControlClaimed: Subject<ControlClaim>;
  public onControlYielded: Subject<ControlClaim>;
  public onPushPaymentProposed: Subject<PushPayment>;
  public onPushPaymentUpdated: Subject<PushPayment>;
  public onPullPaymentProposed: Subject<PullPayment>;
  public onPushPaymentReceived: Subject<PushPayment>;
  public onPullPaymentUpdated: Subject<PullPayment>;
  public onPullPaymentApproved: Subject<PullPayment>;
  public onBalancesChanged: Subject<Balances>;

  constructor() {
    this.config = new HypernetConfig(
      "iframeSource",
      "routerMnemonic",
      "routerPublicIdentifier",
      1337,
      "routerUrl",
      "hypertokenAddress",
      "hypernetProtocolDomain",
      5000,
      {
        [1337]: "http://localhost:8545",
      },
    );

    this.onControlClaimed = new Subject<ControlClaim>();
    this.onControlYielded = new Subject<ControlClaim>();
    this.onPushPaymentProposed = new Subject<PushPayment>();
    this.onPushPaymentUpdated = new Subject<PushPayment>();
    this.onPushPaymentReceived = new Subject<PushPayment>();
    this.onPullPaymentProposed = new Subject<PullPayment>();
    this.onPullPaymentUpdated = new Subject<PullPayment>();
    this.onPullPaymentApproved = new Subject<PullPayment>();
    this.onBalancesChanged = new Subject<Balances>();

    this.context = new InitializedHypernetContext(
      "account",
      "publicIdentifier",
      true,
      this.onControlClaimed,
      this.onControlYielded,
      this.onPushPaymentProposed,
      this.onPullPaymentProposed,
      this.onPushPaymentReceived,
      this.onPullPaymentApproved,
      this.onPushPaymentUpdated,
      this.onPullPaymentUpdated,
      this.onBalancesChanged,
    );

    when(this.configProvider.getConfig()).thenReturn(okAsync(this.config));
    when(this.contextProvider.getInitializedContext()).thenReturn(okAsync(this.context));

    const stateChannels = ["channelAddress"];
    when(this.browserNode.getStateChannels()).thenReturn(okAsync(stateChannels));

    const stateChannel: IFullChannelState = {
      assetIds: [""],
      balances: [{ to: [""], amount: [] }],
      channelAddress: "channelAddress",
      alice: "aliceAddress",
      bob: "bobAddress",
      merkleRoot: "merkleRoot",
      nonce: 0,
      processedDepositsA: [],
      processedDepositsB: [],
      timeout: "timeout",
      aliceIdentifier: "routerPublicIdentifier",
      bobIdentifier: "bobIdentifier",
      latestUpdate: {
        channelAddress: "channelAddress",
        fromIdentifier: "",
        toIdentifier: "",
        type: "setup",
        balance: { to: [""], amount: [""] },
        assetId: "assetId",
        nonce: 0,
        details: {},
      },
      networkContext: {
        chainId: 1337,
        channelFactoryAddress: "channelFactoryAddress",
        transferRegistryAddress: "transferRegistryAddress",
        providerUrl: "providerUrl",
      },
      defundNonces: [],
      inDispute: false,
    };
    when(this.browserNode.getStateChannel("channelAddress")).thenReturn(okAsync(stateChannel));

    when(this.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(resolvableInstance(this.browserNode)));
  }

  public factoryVectorUtils(): VectorUtils {
    return new VectorUtils(
      resolvableInstance(this.configProvider),
      resolvableInstance(this.contextProvider),
      resolvableInstance(this.browserNodeProvider),
      resolvableInstance(this.blockchainProvider),
      resolvableInstance(this.paymentIdUtils),
      resolvableInstance(this.logUtils),
    );
  }
}

describe("VectorUtils tests", () => {
  test("getRouterChannelAddress returns address if channel is already created", async () => {
    // Arrange
    const vectorUtilsMocks = new VectorUtilsMocks();

    const vectorUtils = vectorUtilsMocks.factoryVectorUtils();

    // Act
    const result = await vectorUtils.getRouterChannelAddress();

    // Assert
    expect(result.isOk).toBeTruthy();
    const routerChannelAddress = result._unsafeUnwrap();

    expect(routerChannelAddress).toBe("channelAddress");
  });
});
