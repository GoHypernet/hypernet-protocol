import { VectorError } from "@interfaces/objects/errors";
import { ParameterizedResolver } from "@interfaces/types";
import {
  IBasicChannelResponse,
  IBasicTransferResponse,
  IBrowserNode,
  IConditionalTransferCreatedPayload,
  IConditionalTransferResolvedPayload,
  IFullChannelState,
  IFullTransferState,
  IRegisteredTransfer,
  IWithdrawResponse,
} from "@interfaces/utilities";
import { publicIdentifier, routerChannelAddress } from "@mock/mocks";
import { okAsync, ResultAsync } from "neverthrow";
import td from "testdouble";

export function createBrowserNodeMock(stateChannels: IFullChannelState[] | null = null): IBrowserNode {
  const stateChannelsMap = new Map<string, IFullChannelState>();

  if (stateChannels == null) {
    stateChannelsMap.set(routerChannelAddress, {
      assetIds: [""],
      balances: [{ to: [""], amount: [] }],
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
  }
  else {
    for (const channelState of stateChannels) {
      stateChannelsMap.set(channelState.channelAddress, channelState);
    }
  }
  
  const browserNode = td.object<IBrowserNode>();
  
  td.when(browserNode.setup(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenReturn(okAsync({channelAddress: routerChannelAddress}));
  td.when(browserNode.getStateChannels()).thenReturn(okAsync(Array.from(stateChannelsMap.keys())));

  for (const stateChannel of stateChannelsMap.values()) {
    td.when(browserNode.getStateChannel(stateChannel.channelAddress)).thenReturn(okAsync(stateChannelsMap.get(stateChannel.channelAddress)));
  
  }
  
  return browserNode;
}
