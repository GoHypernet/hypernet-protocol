import { EthereumAddress } from "@hypernetlabs/objects";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export interface IDevelopmentService {
  mintTestToken(
    amount: BigNumber,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError>;
}
