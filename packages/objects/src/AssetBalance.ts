import { BigNumber } from "ethers";

import { EthereumAddress } from "@objects/EthereumAddress";

/**
 * Represents the current balance of a specific asset in the channel.
 * @param assetAddress the Ethereum address of the asset type
 * @param totalAmount the total amount of the asset that has been deposited for use by the Hypernet Protocol.
 * @param lockedAmount the amount of the asset that is currently in use in pending tranfers
 * @param freeAmount the amount of the asset that is available for sending in transfers
 */

export class AssetBalance {
  constructor(
    public assetAddress: EthereumAddress,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalAmount: BigNumber,
    public lockedAmount: BigNumber,
    public freeAmount: BigNumber,
  ) {}
}
