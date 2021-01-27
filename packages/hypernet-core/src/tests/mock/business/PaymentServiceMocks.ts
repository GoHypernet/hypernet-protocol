import { mock, instance } from "ts-mockito";

import { PaymentRepository } from "@implementations/data";
import { IPaymentService } from "@interfaces/business";
import { IAccountsRepository, ILinkRepository, IPaymentRepository } from "@interfaces/data";
import { PaymentService } from "@implementations/business";
import { IConfigProvider, IContextProvider, ILogUtils } from "@interfaces/utilities";
import { EPaymentState } from "@interfaces/types";
import {
  HypernetContext,
  InitializedHypernetContext,
  PushPayment,
  PullAmount,
  BigNumber,
  EthereumAddress,
  PublicKey,
  PullPayment,
} from "@interfaces/objects";
import { mockUtils } from "@mock/mocks";
import moment from "moment";
import { PublicIdentifier } from "@connext/vector-types";

interface IMockedPaymentParams {
  id?: string;
  to?: PublicIdentifier;
  from?: PublicIdentifier;
  state?: EPaymentState;
  paymentToken?: EthereumAddress;
  requiredStake?: BigNumber;
  amountStaked?: BigNumber;
  expirationDate?: number;
  finalized?: boolean;
  createdTimestamp?: moment.Moment;
  updatedTimestamp?: moment.Moment;
  collateralRecovered?: BigNumber;
  disputeMediator?: PublicKey;
  paymentAmount?: BigNumber;
  authorizedAmount?: BigNumber;
  transferedAmount?: BigNumber;
  ledger?: PullAmount[];
}

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

  private static paymentInstance: IMockedPaymentParams = {
    expirationDate: Number(new Date()),
    amountStaked: BigNumber.from("42"),
    paymentToken: mockUtils.generateRandomPaymentToken(),
    disputeMediator: mockUtils.generateRandomEtherAdress(),
    id: mockUtils.generateRandomPaymentId(),
    to: mockUtils.generateRandomEtherAdress(),
    from: mockUtils.generateRandomEtherAdress(),
    state: EPaymentState.Proposed,
    finalized: false,
    requiredStake: BigNumber.from("42"),
    createdTimestamp: moment(moment().format()),
    updatedTimestamp: moment(moment().format()),
    collateralRecovered: BigNumber.from("42"),
    paymentAmount: BigNumber.from("42"),
    authorizedAmount: BigNumber.from("42"),
    transferedAmount: BigNumber.from("42"),
    ledger: [],
  };

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

  public factoryService(): IPaymentService {
    return new PaymentService(
      this.getVectorLinkRepositoryFactory(),
      this.getAccountRepositoryFactory(),
      this.getContextProviderFactory(),
      this.getConfigProviderFactory(),
      this.getPaymentRepositoryFactory(),
      this.getLogUtilsFactory(),
    );
  }

  public factoryPushPayment(options?: IMockedPaymentParams): PushPayment {
    const paymentObject = {
      ...PaymentServiceMocks.paymentInstance,
      ...options,
    } as PushPayment;

    return new PushPayment(
      paymentObject.id,
      paymentObject.to,
      paymentObject.from,
      paymentObject.state,
      paymentObject.paymentToken,
      paymentObject.requiredStake,
      paymentObject.amountStaked,
      paymentObject.expirationDate,
      paymentObject.finalized,
      paymentObject.createdTimestamp,
      paymentObject.updatedTimestamp,
      paymentObject.collateralRecovered,
      paymentObject.disputeMediator,
      paymentObject.paymentAmount,
    );
  }

  public factoryPullPayment(options?: IMockedPaymentParams): PullPayment {
    const paymentObject = {
      ...PaymentServiceMocks.paymentInstance,
      ...options,
    } as PullPayment;
    return new PullPayment(
      paymentObject.id,
      paymentObject.to,
      paymentObject.from,
      paymentObject.state,
      paymentObject.paymentToken,
      paymentObject.requiredStake,
      paymentObject.amountStaked,
      paymentObject.expirationDate,
      paymentObject.finalized,
      paymentObject.createdTimestamp,
      paymentObject.updatedTimestamp,
      paymentObject.collateralRecovered,
      paymentObject.disputeMediator,
      paymentObject.authorizedAmount,
      paymentObject.transferedAmount,
      paymentObject.ledger,
    );
  }
}
