import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { EthereumAddress } from "@hypernetlabs/objects";
import { BlockchainUnavailableError, InvalidParametersError } from "@hypernetlabs/objects";
import { ResultAsync, errAsync } from "neverthrow";
import { BigNumber } from "ethers";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(
    amount: BigNumber,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError | InvalidParametersError> {
    if (!amount || !to) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }
    return this.accountRepo.mintTestToken(amount, to);
  }
}
