import {
  ChainId,
  EthereumAddress,
  PublicIdentifier,
} from "@hypernetlabs/objects";

export interface IStateChannelRequest {
  chainId: ChainId;
  routerPublicIdentifiers: PublicIdentifier[];
  callback: (channelAddress: EthereumAddress) => void;
}
