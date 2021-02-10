import td from "testdouble";
require("testdouble-jest")(td, jest);
import {
  commonAmount,
  routerChannelAddress,
  publicIdentifier,
  commonPaymentId,
  mockUtils,
  publicIdentifier2,
} from "@mock/mocks";
import { BlockchainProviderMock, BrowserNodeProviderMock, ConfigProviderMock, ContextProviderMock } from "@mock/utils";
import { BigNumber, PushPayment, PublicIdentifier, HypernetLink } from "@interfaces/objects";
import { IVectorUtils, IBrowserNodeProvider, IPaymentUtils, ILinkUtils } from "@interfaces/utilities";
import { VectorError } from "@interfaces/objects/errors";
import { ILinkRepository } from "@interfaces/data";
import { okAsync, errAsync } from "neverthrow";

const moment = td.replace("moment", () => {
  return {
    format: () => {
      return "2021-02-03T04:28:09+03:00";
    },
    unix: () => {
      return 1318874398;
    },
  };
});
import { VectorLinkRepository } from "@implementations/data/VectorLinkRepository";
import { EPaymentState } from "@interfaces/types";

const paymentToken = mockUtils.generateRandomPaymentToken();
const disputeMediator = mockUtils.generateRandomEtherAdress();
const now = moment();
const expirationDate = moment(now.format());
const paymentId = commonPaymentId;
const counterPartyAccount = publicIdentifier2;
const fromAccount = publicIdentifier;
const nonExistedAccount = counterPartyAccount.replace("vector", "sector");

class VectorLinkRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public configProvider = new ConfigProviderMock();
  public contextProvider = new ContextProviderMock();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public paymentUtils = td.object<IPaymentUtils>();
  public linkUtils = td.object<ILinkUtils>();
  public createdPushPayment: PushPayment;

  constructor() {
    this.createdPushPayment = this.factoryPushPayment();

    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));

    td.when(
      this.paymentUtils.transfersToPayments(
        [this.browserNodeProvider.fullTransferState],
        this.configProvider.config,
        this.contextProvider.initializedContext,
        this.browserNodeProvider.browserNode,
      ),
    ).thenReturn(okAsync([this.createdPushPayment]));
    td.when(
      this.paymentUtils.transfersToPayments(
        [],
        this.configProvider.config,
        this.contextProvider.initializedContext,
        this.browserNodeProvider.browserNode,
      ),
    ).thenReturn(okAsync([]));

    td.when(
      this.linkUtils.paymentsToHypernetLinks([this.createdPushPayment], this.contextProvider.initializedContext),
    ).thenReturn(
      okAsync([
        new HypernetLink(
          counterPartyAccount,
          [this.createdPushPayment],
          [this.createdPushPayment],
          [],
          [this.createdPushPayment],
          [],
        ),
      ]),
    );
    td.when(this.linkUtils.paymentsToHypernetLinks([], this.contextProvider.initializedContext)).thenReturn(
      okAsync([]),
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
    );
  }

  public factoryPushPayment(
    to: PublicIdentifier = counterPartyAccount,
    from: PublicIdentifier = fromAccount,
    state: EPaymentState = EPaymentState.Proposed,
    amountStaked: string = commonAmount.toString(),
  ): PushPayment {
    return new PushPayment(
      paymentId,
      to,
      from,
      state,
      paymentToken,
      BigNumber.from(commonAmount.toString()),
      BigNumber.from(amountStaked),
      expirationDate.unix(),
      false,
      now.unix(),
      now.unix(),
      BigNumber.from(0),
      disputeMediator,
      BigNumber.from(commonAmount.toString()),
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
    expect(result._unsafeUnwrap()).toStrictEqual([
      new HypernetLink(
        counterPartyAccount,
        [vectorLinkRepositoryMocks.createdPushPayment],
        [vectorLinkRepositoryMocks.createdPushPayment],
        [],
        [vectorLinkRepositoryMocks.createdPushPayment],
        [],
      ),
    ]);
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
    expect(result._unsafeUnwrap()).toStrictEqual(
      new HypernetLink(
        counterPartyAccount,
        [vectorLinkRepositoryMocks.createdPushPayment],
        [vectorLinkRepositoryMocks.createdPushPayment],
        [],
        [vectorLinkRepositoryMocks.createdPushPayment],
        [],
      ),
    );
  });

  test("Should getHypernetLink return empty array if counterpartyId is not exist without errors", async () => {
    // Arrange
    const vectorLinkRepositoryMocks = new VectorLinkRepositoryMocks();
    const repo = vectorLinkRepositoryMocks.factoryVectorLinkRepository();

    // Act
    const result = await repo.getHypernetLink(nonExistedAccount);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(new HypernetLink(nonExistedAccount, [], [], [], [], []));
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
