import {
  PushPayment,
  HypernetLink,
  Payment,
  VectorError,
  EPaymentState,
  BigNumberString,
  UnixTimestamp,
  SortedTransfers,
} from "@hypernetlabs/objects";
import { ILinkRepository } from "@interfaces/data";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { VectorLinkRepository } from "@implementations/data/VectorLinkRepository";
import {
  IVectorUtils,
  IBrowserNodeProvider,
  IPaymentUtils,
  ILinkUtils,
  ITimeUtils,
} from "@interfaces/utilities";
import {
  commonAmount,
  publicIdentifier,
  commonPaymentId,
  publicIdentifier2,
  unixNow,
  defaultExpirationLength,
  erc20AssetAddress,
  gatewayUrl,
  publicIdentifier3,
  offerTransferId,
  insuranceTransferId,
  parameterizedTransferId,
  routerChannelAddress,
  chainId,
  routerPublicIdentifier,
} from "@mock/mocks";
import {
  BlockchainProviderMock,
  BrowserNodeProviderMock,
  ConfigProviderMock,
  ContextProviderMock,
  PaymentUtilsMockFactory,
  VectorUtilsMockFactory,
} from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

const expirationDate = UnixTimestamp(unixNow + defaultExpirationLength);
const counterPartyAccount = publicIdentifier2;
const fromAccount = publicIdentifier;
const paymentDetails = new SortedTransfers([], [], [], []);

class VectorLinkRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils =
    VectorUtilsMockFactory.factoryVectorUtils(expirationDate);
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

    td.when(this.timeUtils.getUnixNow()).thenReturn(unixNow as never);
    td.when(this.timeUtils.getBlockchainTimestamp()).thenReturn(
      okAsync(unixNow),
    );
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
    amountStaked: BigNumberString = commonAmount,
  ): PushPayment {
    return new PushPayment(
      commonPaymentId,
      routerPublicIdentifier,
      chainId,
      counterPartyAccount,
      fromAccount,
      state,
      erc20AssetAddress,
      commonAmount,
      amountStaked,
      expirationDate,
      unixNow,
      unixNow,
      BigNumberString("0"),
      gatewayUrl,
      paymentDetails,
      null,
      commonAmount,
      BigNumberString("0"),
    );
  }
}

class VectorLinkRepositoryErrorMocks {
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  private vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(
      errAsync(new VectorError()),
    );
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
    const result = await repo.getHypernetLinks(routerChannelAddress);

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
    const result = await repo.getHypernetLinks(routerChannelAddress);
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
    const result = await repo.getHypernetLink(
      routerChannelAddress,
      counterPartyAccount,
    );

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
    const result = await repo.getHypernetLink(
      routerChannelAddress,
      publicIdentifier3,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(
      new HypernetLink(publicIdentifier3, [], [], [], [], []),
    );
  });

  test("Should getHypernetLink return error if getBrowserNode failed", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryErrorMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLink(
      routerChannelAddress,
      counterPartyAccount,
    );
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });
});
