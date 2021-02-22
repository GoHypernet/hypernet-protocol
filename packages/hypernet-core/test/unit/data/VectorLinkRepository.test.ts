import td from "testdouble";
require("testdouble-jest")(td, jest);
import {
  commonAmount,
  routerChannelAddress,
  publicIdentifier,
  commonPaymentId,
  publicIdentifier2,
  unixNow,
  defaultExpirationLength,
  erc20AssetAddress,
  merchantUrl,
  publicIdentifier3,
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
} from "@mock/mocks";
import {
  BlockchainProviderMock,
  BrowserNodeProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  PaymentUtilsMockFactory,
} from "@mock/utils";
import { BigNumber, PushPayment, HypernetLink, Payment, PaymentInternalDetails } from "@interfaces/objects";
import { IVectorUtils, IBrowserNodeProvider, IPaymentUtils, ILinkUtils, ITimeUtils } from "@interfaces/utilities";
import { VectorError } from "@interfaces/objects/errors";
import { ILinkRepository } from "@interfaces/data";
import { okAsync, errAsync } from "neverthrow";
import { VectorLinkRepository } from "@implementations/data/VectorLinkRepository";
import { EPaymentState } from "@interfaces/types";

const expirationDate = unixNow + defaultExpirationLength;
const counterPartyAccount = publicIdentifier2;
const fromAccount = publicIdentifier;
const paymentDetails = new PaymentInternalDetails(offerTransferId, insuranceTransferId, parameterizedTransferId, []);

class VectorLinkRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public linkUtils = td.object<ILinkUtils>();
  public timeUtils = td.object<ITimeUtils>();
  public paymentUtils: IPaymentUtils;
  public proposedPayment: PushPayment;
  public stakedPayment: PushPayment;
  public approvedPayment: PushPayment;
  public createdLink: HypernetLink;

  constructor() {
    this.proposedPayment = this.factoryPushPayment(EPaymentState.Proposed);
    this.stakedPayment = this.factoryPushPayment(EPaymentState.Staked);
    this.approvedPayment = this.factoryPushPayment(EPaymentState.Approved);

    this.paymentUtils = PaymentUtilsMockFactory.factoryPaymentUtils(
      this.browserNodeProvider,
      this.proposedPayment,
      this.stakedPayment,
      this.approvedPayment,
    );

    this.createdLink = new HypernetLink(
      counterPartyAccount,
      [this.proposedPayment],
      [this.proposedPayment],
      [],
      [this.proposedPayment],
      [],
    );

    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));

    td.when(
      this.linkUtils.paymentsToHypernetLinks(
        td.matchers.argThat((val: Payment[]) => {
          return val.length > 0;
        }),
      ),
    ).thenReturn(okAsync([this.createdLink]));
    td.when(
      this.linkUtils.paymentsToHypernetLinks(
        td.matchers.argThat((val: Payment[]) => {
          return val.length == 0;
        }),
      ),
    ).thenReturn(okAsync([]));

    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow);
  }

  public factoryVectorLinkRepository(): ILinkRepository {
    return new VectorLinkRepository(
      this.browserNodeProvider,
      this.configProvider,
      this.contextProvider,
      this.vectorUtils,
      this.paymentUtils,
      this.linkUtils,
      this.timeUtils,
    );
  }

  public factoryPushPayment(
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: string = commonAmount.toString(),
  ): PushPayment {
    return new PushPayment(
      commonPaymentId,
      counterPartyAccount,
      fromAccount,
      state,
      erc20AssetAddress,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(amountStaked),
      expirationDate,
      unixNow,
      unixNow,
      BigNumber.from(0),
      merchantUrl,
      paymentDetails,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(0),
    );
  }
}

class VectorLinkRepositoryErrorMocks {
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  private vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(errAsync(new VectorError()));
  }

  public factoryVectorLinkRepository(): ILinkRepository {
    return new VectorLinkRepository(
      this.browserNodeProvider,
      this.vectorLinkRepositoryMocks.configProvider,
      this.vectorLinkRepositoryMocks.contextProvider,
      this.vectorLinkRepositoryMocks.vectorUtils,
      this.vectorLinkRepositoryMocks.paymentUtils,
      this.vectorLinkRepositoryMocks.linkUtils,
      this.vectorLinkRepositoryMocks.timeUtils,
    );
  }
}

describe("VectorLinkRepository tests", () => {
  test("Should getHypernetLinks return HypernetLinks without errors", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLinks();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const links = result._unsafeUnwrap();
    expect(links[0]).toBe(vectorLinkRepositoryMocks.createdLink);
  });

  test("Should getHypernetLinks return error if getBrowserNode failed", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryErrorMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLinks();
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should getHypernetLink return HypernetLink if counterpartyId exists without errors", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLink(counterPartyAccount);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const link = result._unsafeUnwrap();
    expect(link).toStrictEqual(vectorLinkRepositoryMocks.createdLink);
  });

  test("Should getHypernetLink return empty array if counterpartyId is not exist without errors", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLink(publicIdentifier3);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(new HypernetLink(publicIdentifier3, [], [], [], [], []));
  });

  test("Should getHypernetLink return error if getBrowserNode failed", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryErrorMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLink(counterPartyAccount);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });
});
