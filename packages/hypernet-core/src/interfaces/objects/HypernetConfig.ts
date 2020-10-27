import {
  ChainAddresses,
  ChainProviders,
} from "@connext/vector-types";

export class HypernetConfig {
  constructor(
    public authUrl: string,
    public natsUrl: string,
    public chainAddresses: ChainAddresses,
    public chainProviders: ChainProviders,
    public mnemonic: string
  ) { }
}
