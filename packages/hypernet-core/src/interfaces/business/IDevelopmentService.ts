import { EthereumAddress } from "3box";
import { BigNumber, ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";

export interface IDevelopmentService {
  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, LogicalError>;
}
