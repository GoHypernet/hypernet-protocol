import { BigNumber, EthereumAddress, ResultAsync } from "@interfaces/objects";
import { LogicalError } from "@interfaces/objects/errors";

export interface IDevelopmentService {
  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, LogicalError>;
}
