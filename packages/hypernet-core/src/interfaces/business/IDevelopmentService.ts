import {
  EthereumAccountAddress,
  BlockchainUnavailableError,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDevelopmentService {
  mintTestToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;
}
