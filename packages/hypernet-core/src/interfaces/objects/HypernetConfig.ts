import { PublicIdentifier } from "@connext/vector-types";
import { EthereumAddress } from "./EthereumAddress";

export class HypernetConfig {
  constructor(
    public iframeSource: string,
    public routerMnemonic: string,
    public routerPublicIdentifier: PublicIdentifier,
    public chainId: number,
    public routerUrl: string,
    public hypertokenAddress: EthereumAddress,
    public hypernetProtocolDomain: string,
    public defaultPaymentExpiryLength: number,
  ) {}
}
