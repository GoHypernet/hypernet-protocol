import { IBrowserNode, IFullChannelState } from "@interfaces/utilities";
import { chainId, routerChannelAddress, routerPublicIdentifier } from "@mock/mocks";
import { okAsync } from "neverthrow";
import td from "testdouble";
import { DEFAULT_CHANNEL_TIMEOUT } from "@connext/vector-types";

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
      aliceIdentifier: routerPublicIdentifier,
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
        chainId: chainId,
        channelFactoryAddress: "channelFactoryAddress",
        transferRegistryAddress: "transferRegistryAddress",
      },
      defundNonces: [],
      inDispute: false,
    });
  } else {
    for (const channelState of stateChannels) {
      stateChannelsMap.set(channelState.channelAddress, channelState);
    }
  }

  const browserNode = td.object<IBrowserNode>();

  td.when(browserNode.setup(routerPublicIdentifier, chainId, DEFAULT_CHANNEL_TIMEOUT.toString())).thenReturn(
    okAsync({ channelAddress: routerChannelAddress }),
  );
  td.when(browserNode.getStateChannels()).thenReturn(okAsync(Array.from(stateChannelsMap.keys())));

  for (const stateChannel of stateChannelsMap.values()) {
    td.when(browserNode.getStateChannel(stateChannel.channelAddress)).thenReturn(
      okAsync(stateChannelsMap.get(stateChannel.channelAddress)),
    );
  }

  return browserNode;
}
