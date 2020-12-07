import { EthereumAddress } from "3box";
import { BigNumber } from "@interfaces/objects";

export interface IDevelopmentService {
  mintTestToken(amount: BigNumber, to: EthereumAddress): Promise<void>;
}
