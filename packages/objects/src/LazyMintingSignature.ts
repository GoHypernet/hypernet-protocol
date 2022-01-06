import { EthereumAccountAddress } from "@objects/EthereumAccountAddress";

export class LazyMintingSignature {
  constructor(
    public mintingSignature: string,
    public registrarAddress: EthereumAccountAddress,
    public accountAddress: EthereumAccountAddress,
  ) {}
}
