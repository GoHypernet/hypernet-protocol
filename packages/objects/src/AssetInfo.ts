import { EthereumAddress } from "@objects/EthereumAddress";

export class AssetInfo {
  constructor(
    public assetId: EthereumAddress,
    public name: string,
    public symbol: string,
    public decimals: number,
  ) {}
}
