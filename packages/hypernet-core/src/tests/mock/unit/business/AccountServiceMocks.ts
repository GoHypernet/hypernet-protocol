import { mock, instance } from "ts-mockito";

import { IAccountService } from "@interfaces/business";
import { InitializedHypernetContext } from "@interfaces/objects";
import { IAccountsRepository } from "@interfaces/data";
import { AccountService } from "@implementations/business";
import { IContextProvider } from "@interfaces/utilities";

export default class AccountServiceMocks {
  public accountRepository: IAccountsRepository = mock<IAccountsRepository>();
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public initializedHypernetContext = mock(InitializedHypernetContext);

  public getAccountRepositoryFactory(): IAccountsRepository {
    return instance(this.accountRepository);
  }

  public getContextProviderFactory(): IContextProvider {
    return instance(this.contextProvider);
  }

  public getInitializedHypernetContextFactory(): InitializedHypernetContext {
    return instance(this.initializedHypernetContext);
  }

  public getServiceFactory(): IAccountService {
    return new AccountService(this.getAccountRepositoryFactory(), this.getContextProviderFactory());
  }
}
