import { EthereumAddress } from "@hypernetlabs/objects";
import { LogicalError } from "@hypernetlabs/objects/errors";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IDevelopmentService {
  mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, LogicalError>;
}
