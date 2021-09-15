import {
  ActiveStateChannel,
  ChainId,
  EthereumAddress,
  PublicIdentifier,
} from "@hypernetlabs/objects";

export interface IStateChannelRequest {
  chainId: ChainId;
  routerPublicIdentifiers: PublicIdentifier[];
  callback: (stateChannel: ActiveStateChannel) => void;
}
