import { BigNumberString } from "@objects/BigNumberString";
import { EthereumContractAddress } from "@objects/EthereumContractAddress";

/**
 * Represents the current balance of a specific asset in the channel.
 * @param assetAddress the Ethereum address of the asset type
 * @param totalAmount the total amount of the asset that has been deposited for use by the Hypernet Protocol.
 * @param lockedAmount the amount of the asset that is currently in use in pending tranfers
 * @param freeAmount the amount of the asset that is available for sending in transfers
 */

export class AssetBalance {
  constructor(
    public channelAddress: EthereumContractAddress,
    public assetAddress: EthereumContractAddress,
    public name: string,
    public symbol: string,
    public decimals: number,
    public totalAmount: BigNumberString,
    public lockedAmount: BigNumberString,
    public freeAmount: BigNumberString,
  ) {}
}
