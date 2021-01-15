import { mock, instance } from "ts-mockito";

import { PaymentRepository } from "@implementations/data";
import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository, IPaymentRepository } from "@interfaces/data";
import { PaymentService } from "@implementations/business";
import { IConfigProvider, IContextProvider, ILogUtils } from "@interfaces/utilities";
import { HypernetContext, InitializedHypernetContext } from "@interfaces/objects";

// normal ts-mock "when" function won't work (issue: https://github.com/NagRock/ts-mockito/issues/209) that's why we had to write a different implementation here
jest.mock("@implementations/data");

PaymentRepository.prototype.getPaymentsByIds = jest.fn();
PaymentRepository.prototype.createPushPayment = jest.fn();

export default class PaymentServiceMocks {
  public vectorLinkRepository: ILinkRepository = mock<ILinkRepository>();
  public accountRepository: IAccountsRepository = mock<IAccountsRepository>();
  public contextProvider: IContextProvider = mock<IContextProvider>();
  public configProvider: IConfigProvider = mock<IConfigProvider>();
  public logUtils: ILogUtils = mock<ILogUtils>();
  public paymentRepository = PaymentRepository;
  public initializedHypernetContext = mock(InitializedHypernetContext);
  public hypernetContext: HypernetContext = mock(HypernetContext);

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
    const paymentRepositoryInstance = new (PaymentRepository as any)() as IPaymentRepository;
    return paymentRepositoryInstance;
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

  public getServiceFactory(): IPaymentService {
    return new PaymentService(
      this.getVectorLinkRepositoryFactory(),
      this.getAccountRepositoryFactory(),
      this.getContextProviderFactory(),
      this.getConfigProviderFactory(),
      this.getPaymentRepositoryFactory(),
      this.getLogUtilsFactory(),
    );
  }
}
