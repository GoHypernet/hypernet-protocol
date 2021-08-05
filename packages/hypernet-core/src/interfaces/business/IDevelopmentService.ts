import {
  EthereumAddress,
  BlockchainUnavailableError,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IDevelopmentService {
  mintTestToken(
    amount: BigNumberString,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;
}
