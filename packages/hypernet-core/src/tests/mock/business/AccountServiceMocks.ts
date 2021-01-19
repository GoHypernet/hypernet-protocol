import { mock, instance } from "ts-mockito";

import { IAccountService } from "@interfaces/business";
import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";
import { IAccountsRepository } from "@interfaces/data";
import { AccountService } from "@implementations/business";
import { IContextProvider, ILogUtils } from "@interfaces/utilities";

export default class AccountServiceMocks {
  public accountRepository: IAccountsRepository = mock<IAccountsRepository>();
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public initializedHypernetContext = mock(InitializedHypernetContext);
  public logUtils: ILogUtils = mock<ILogUtils>();
  public hypernetContext: HypernetContext = mock(HypernetContext);

  public getAccountRepositoryFactory(): IAccountsRepository {
    return instance(this.accountRepository);
  }

  public getContextProviderFactory(): IContextProvider {
    return instance(this.contextProvider);
  }

  public getInitializedHypernetContextFactory(): InitializedHypernetContext {
    return instance(this.initializedHypernetContext);
  }

  public getLogUtilsFactory(): ILogUtils {
    return instance(this.logUtils);
  }

  public getHypernetContextFactory(): HypernetContext {
    return instance(this.hypernetContext);
  }

  public factoryService(): IAccountService {
    return new AccountService(
      this.getAccountRepositoryFactory(),
      this.getContextProviderFactory(),
      this.getLogUtilsFactory(),
    );
  }
}
