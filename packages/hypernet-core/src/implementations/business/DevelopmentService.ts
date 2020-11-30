import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { BigNumber } from "@interfaces/objects";

export class DevelopmentService implements IDevelopmentService {
    constructor(protected accountRepo: IAccountsRepository) {}

  public async mintTestToken(amount: BigNumber): Promise<void> {
      return this.accountRepo.mintTestToken(amount);
  }
}
