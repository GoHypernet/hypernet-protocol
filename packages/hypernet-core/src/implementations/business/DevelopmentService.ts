import { EthereumAddress } from "@hypernetlabs/objects";
import { BlockchainUnavailableError } from "@hypernetlabs/objects";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";

export class DevelopmentService implements IDevelopmentService {
  constructor(protected accountRepo: IAccountsRepository) {}

  public mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError> {
    return this.accountRepo.mintTestToken(amount, to);
  }
}
