import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { BigNumber, EthereumAddress, ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError> {
    return this.accountRepo.mintTestToken(amount, to);
  }
}
