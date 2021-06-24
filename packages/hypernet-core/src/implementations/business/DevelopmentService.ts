import {
  BigNumberString,
  EthereumAddress,
  BlockchainUnavailableError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(
    amount: BigNumberString,
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
    return this.accountRepo.mintTestToken(amount, to);
  }
}
