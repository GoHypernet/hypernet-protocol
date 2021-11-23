import {
  BigNumberString,
  EthereumAccountAddress,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { ResultAsync } from "neverthrow";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.accountRepo.mintTestToken(amount, to);
  }
}
