import { AssetBalance } from "./AssetBalance";

/**
 * Represents all assets within the channel, including locked and free amounts
 * @param assets the collection of AssetBalances within the channel
 */
export class Balances {
  constructor(public assets: AssetBalance[]) {}
}
