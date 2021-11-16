import { ChainId } from "@objects/ChainId";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class TokenInformation {
  public constructor(
    public name: string,
    public symbol: string,
    public chainId: ChainId,
    public address: EthereumContractAddress,
    public nativeToken: boolean,
    public erc20: boolean,
    public decimals: number,
    public logoUrl: string,
  ) {}
}
