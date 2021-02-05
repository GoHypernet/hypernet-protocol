import { VectorError } from "@interfaces/objects/errors";
import {
  IBrowserNode,
  IBrowserNodeProvider,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawResponse,
} from "@interfaces/utilities";
import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";
import {
  publicIdentifier,
  routerChannelAddress,
  ethereumAddress,
  erc20AssetAddress,
  commonAmount,
  destinationAddress,
  commonPaymentId,
} from "@mock/mocks";

export class BrowserNodeProviderMock implements IBrowserNodeProvider {
  public browserNode: IBrowserNode;
  public stateChannels = new Map<string, IFullChannelState>();
  public fullTransferState: IFullTransferState;

  constructor(browserNode: IBrowserNode | null = null) {
    // Create the default set of state channels
    this.stateChannels.set(routerChannelAddress, {
      assetIds: [erc20AssetAddress],
      balances: [
        {
          amount: ["43", "43"],
          to: [destinationAddress],
        },
      ],
      channelAddress: routerChannelAddress,
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
    });

    this.fullTransferState = {
      balance: {
        amount: ["43", "43"],
        to: [destinationAddress],
      },
      assetId: erc20AssetAddress,
      channelAddress: routerChannelAddress,
      inDispute: false,
      transferId: commonPaymentId,
      transferDefinition: destinationAddress,
      transferTimeout: "string",
      initialStateHash: "string",
      initiator: erc20AssetAddress,
      responder: erc20AssetAddress,
      channelFactoryAddress: "channelFactoryAddress",
      chainId: 1337,
      transferEncodings: ["string"],
      transferState: {
        UUID: commonPaymentId,
      },
      channelNonce: 1,
      initiatorIdentifier: publicIdentifier,
      responderIdentifier: publicIdentifier,
    };

    // If we were not provided with a specific browser node, set up a mock one.
    if (browserNode == null) {
      this.browserNode = td.object<IBrowserNode>();
      td.when(this.browserNode.getStateChannels()).thenReturn(okAsync(Array.from(this.stateChannels.keys())));
      td.when(this.browserNode.getStateChannel(routerChannelAddress)).thenReturn(
        okAsync(this.stateChannels.get(routerChannelAddress)),
      );

      // @todo: Figure out if there is a better way to stub get properties
      (this.browserNode as any).publicIdentifier = publicIdentifier;

      td.when(this.browserNode.reconcileDeposit(ethereumAddress, routerChannelAddress)).thenReturn(
        okAsync(routerChannelAddress),
      );
      td.when(this.browserNode.reconcileDeposit(erc20AssetAddress, routerChannelAddress)).thenReturn(
        okAsync(routerChannelAddress),
      );

      td.when(
        this.browserNode.withdraw(
          routerChannelAddress,
          commonAmount.toString(),
          ethereumAddress,
          destinationAddress,
          "0",
        ),
      ).thenReturn(okAsync({} as IWithdrawResponse));

      td.when(
        this.browserNode.withdraw(
          routerChannelAddress,
          commonAmount.toString(),
          erc20AssetAddress,
          destinationAddress,
          "0",
        ),
      ).thenReturn(okAsync({} as IWithdrawResponse));

      td.when(this.browserNode.getTransfer(commonPaymentId)).thenReturn(okAsync(this.fullTransferState));

      td.when(this.browserNode.getActiveTransfers(routerChannelAddress)).thenReturn(okAsync([this.fullTransferState]));

      td.when(this.browserNode.getRegisteredTransfers(this.fullTransferState.chainId)).thenReturn(
        okAsync([
          {
            name: "Insurance",
            stateEncoding: "stateEncoding",
            resolverEncoding: "resolverEncoding",
            definition: this.fullTransferState.transferDefinition,
            encodedCancel: "encodedCancel",
          } as IRegisteredTransfer,
        ]),
      );
    } else {
      this.browserNode = browserNode;
    }
  }

  getBrowserNode(): ResultAsync<IBrowserNode, VectorError | Error> {
    const result = okAsync<IBrowserNode, VectorError | Error>(this.browserNode);
    return result;
  }
}
