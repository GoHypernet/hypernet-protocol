import {
  ActiveStateChannel,
  ChainId,
  PublicIdentifier,
} from "@hypernetlabs/objects";

export interface IStateChannelRequest {
  chainId: ChainId;
  routerPublicIdentifiers: PublicIdentifier[];
  callback: (stateChannel: ActiveStateChannel) => void;
}
