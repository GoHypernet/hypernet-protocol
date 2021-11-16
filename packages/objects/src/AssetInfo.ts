import { EthereumContractAddress } from "@objects/EthereumContractAddress";

export class AssetInfo {
  constructor(
    public assetId: EthereumContractAddress,
    public name: string,
    public symbol: string,
    public decimals: number,
  ) {}
}
