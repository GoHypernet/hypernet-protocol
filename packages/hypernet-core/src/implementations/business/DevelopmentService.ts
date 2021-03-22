import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { EthereumAddress } from "@hypernetlabs/objects";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";
import { BigNumber } from "ethers";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError> {
    return this.accountRepo.mintTestToken(amount, to);
  }
}
