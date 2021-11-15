import { EthereumContractAddress } from "@objects/EthereumContractAddress";

import { ChainId } from "@objects/ChainId";

export class SupportedToken {
  public constructor(
    public name: string,
    public symbol: string,
    public chainId: ChainId,
    public address: EthereumContractAddress,
    public nativeToken: boolean,
    public erc20: boolean,
    public decimals: number,
  ) {}
}
