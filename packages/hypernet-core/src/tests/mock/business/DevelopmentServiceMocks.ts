import { mock, instance } from "ts-mockito";

import { IDevelopmentService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { DevelopmentService } from "@implementations/business";

export default class DevelopmentServiceMocks {
  public accountRepository: IAccountsRepository = mock<IAccountsRepository>();

  public getAccountRepositoryFactory(): IAccountsRepository {
    return instance(this.accountRepository);
  }

  public getServiceFactory(): IDevelopmentService {
    return new DevelopmentService(this.getAccountRepositoryFactory());
  }
}
