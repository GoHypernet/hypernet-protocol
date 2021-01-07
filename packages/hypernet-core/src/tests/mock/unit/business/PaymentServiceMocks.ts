import { mock, instance } from "ts-mockito";

import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository, IPaymentRepository } from "@interfaces/data";
import { PaymentService } from "@implementations/business";
import { IConfigProvider, IContextProvider } from "@interfaces/utilities";
import { InitializedHypernetContext } from "@interfaces/objects";

export default class PaymentServiceMocks {
  public vectorLinkRepository: ILinkRepository = mock<ILinkRepository>();
  public accountRepository: IAccountsRepository = mock<IAccountsRepository>();
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public configProvider: IConfigProvider = mock<IConfigProvider>();
  public paymentRepository: IPaymentRepository = mock<IPaymentRepository>();
  public initializedHypernetContext = mock(InitializedHypernetContext);

  public getVectorLinkRepositoryFactory(): ILinkRepository {
    return instance(this.vectorLinkRepository);
  }

  public getAccountRepositoryFactory(): IAccountsRepository {
    return instance(this.accountRepository);
  }

  public getContextProviderFactory(): IContextProvider {
    return instance(this.contextProvider);
  }

  public getConfigProviderFactory(): IConfigProvider {
    return instance(this.configProvider);
  }

  public getPaymentRepositoryFactory(): IPaymentRepository {
    return instance(this.paymentRepository);
  }

  public getInitializedHypernetContextFactory(): InitializedHypernetContext {
    return instance(this.initializedHypernetContext);
  }

  public getServiceFactory(): IPaymentService {
    return new PaymentService(
      this.getVectorLinkRepositoryFactory(),
      this.getAccountRepositoryFactory(),
      this.getContextProviderFactory(),
      this.getConfigProviderFactory(),
      this.getPaymentRepositoryFactory(),
    );
  }
}
