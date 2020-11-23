import { EthereumAddress } from "3box";
import {
  ChainAddresses,
  ChainProviders,
  PublicIdentifier,
} from "@connext/vector-types";

export class HypernetConfig {
  constructor(
    public authUrl: string,
    public natsUrl: string,
    public chainAddresses: ChainAddresses,
    public chainProviders: ChainProviders,
    public routerMnemonic: string,
    public routerPublicIdentifier: PublicIdentifier,
    public chainId: number,
    public routerUrl: string,
    public hypertokenAddress: EthereumAddress,
    public hypernetProtocolDomain: string,
  ) { }
}
