import { when } from "ts-mockito";
import { errAsync, okAsync } from "neverthrow";

import { Balances, BigNumber, AssetBalance } from "@interfaces/objects";
import AccountsRepositoryMocks from "../../mock/data/AccountsRepositoryMocks";
import { BrowserNode } from "@connext/vector-browser-node";
import { mockUtils } from "../../mock/utils";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  RouterChannelUnknownError,
} from "@interfaces/objects/errors";
import { NodeResponses } from "@connext/vector-types";
import { CoreChannelState, Result } from "@connext/vector-types";
const { when: jestWhen } = require("jest-when");

describe("AccountsRepository tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const publicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const routerPublicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const supportedChains = [2323];

    const browserNode = new BrowserNode({
      routerPublicIdentifier,
      supportedChains,
      chainProviders: {
        [supportedChains[0]]: "asdad",
      },
    });
    browserNode.publicIdentifier = publicIdentifier;

    // Act
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(browserNode));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getPublicIdentifier())._unsafeUnwrap()).toStrictEqual(
      publicIdentifier,
    );
  });

  test("Should getPublicIdentifier throw error", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const err = new Error();

    // Act
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(errAsync(err));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getPublicIdentifier())._unsafeUnwrapErr()).toStrictEqual(
      err,
    );
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const provider = mockUtils.generateMockProvider();
    const accounts = await provider.listAccounts();

    // Act
    when(accountsRepositoryMocks.blockchainProvider.getProvider()).thenReturn(okAsync(provider));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getAccounts())._unsafeUnwrap()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const balanceAmount = "43";
    const channelStateMock: CoreChannelState = {
      channelAddress: routerChannelAddress,
      assetIds: [mockUtils.generateRandomEtherAdress()],
      balances: [
        {
          amount: [balanceAmount, balanceAmount],
          to: [mockUtils.generateRandomEtherAdress()],
        },
      ],
      alice: mockUtils.generateRandomEtherAdress(),
      bob: mockUtils.generateRandomEtherAdress(),
      processedDepositsA: ["0"],
      processedDepositsB: ["0"],
      defundNonces: ["0"],
      timeout: "",
      nonce: 23,
      merkleRoot: "",
    };
    const stateChannelRes = Result.ok(channelStateMock);
    const balances: Balances = {
      assets: [
        new AssetBalance(
          channelStateMock.assetIds[0],
          BigNumber.from(channelStateMock.balances[0].amount[1]),
          BigNumber.from(0),
          BigNumber.from(channelStateMock.balances[0].amount[1]),
        ),
      ],
    };

    // Act
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(
      okAsync(accountsRepositoryMocks.getBrowserNodeFactory()),
    );
    jestWhen(accountsRepositoryMocks.browserNode.prototype.getStateChannel)
      .calledWith({ channelAddress: routerChannelAddress })
      .mockResolvedValue(stateChannelRes);

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getBalances())._unsafeUnwrap()).toEqual(balances);
  });

  test("Should getBalances throw error when getRouterChannelAddress fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const throwenError = new RouterChannelUnknownError();

    // Act
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(
      errAsync(new RouterChannelUnknownError()),
    );

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getBalances())._unsafeUnwrapErr()).toStrictEqual(
      throwenError,
    );
  });

  test("Should getBalances throw error when getBrowserNode fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const throwenError = new BalancesUnavailableError("Channel not found");

    // Act
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(errAsync(throwenError));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().getBalances())._unsafeUnwrapErr()).toStrictEqual(
      throwenError,
    );
  });

  test("Should getBalanceByAsset return balances by asset", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const byAssetAddress = mockUtils.generateRandomEtherAdress();
    const balanceAmount = "43";
    const channelStateMock: CoreChannelState = {
      channelAddress: routerChannelAddress,
      assetIds: [byAssetAddress],
      balances: [
        {
          amount: [balanceAmount, balanceAmount],
          to: [mockUtils.generateRandomEtherAdress()],
        },
      ],
      alice: mockUtils.generateRandomEtherAdress(),
      bob: mockUtils.generateRandomEtherAdress(),
      processedDepositsA: ["0"],
      processedDepositsB: ["0"],
      defundNonces: ["0"],
      timeout: "",
      nonce: 23,
      merkleRoot: "",
    };
    const stateChannelRes = Result.ok(channelStateMock);
    const assetBalance: AssetBalance = new AssetBalance(
      channelStateMock.assetIds[0],
      BigNumber.from(channelStateMock.balances[0].amount[1]),
      BigNumber.from(0),
      BigNumber.from(channelStateMock.balances[0].amount[1]),
    );

    // Act
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(
      okAsync(accountsRepositoryMocks.getBrowserNodeFactory()),
    );
    jestWhen(accountsRepositoryMocks.browserNode.prototype.getStateChannel)
      .calledWith({ channelAddress: routerChannelAddress })
      .mockResolvedValue(stateChannelRes);

    // Assert
    expect(
      (await accountsRepositoryMocks.getServiceFactory().getBalanceByAsset(byAssetAddress))._unsafeUnwrap(),
    ).toEqual(assetBalance);
  });

  test("Should depositFunds without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("43");
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const provider = mockUtils.generateMockProvider();
    const signer = await provider.getSigner();
    const routerPublicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const supportedChains = [2323];
    const browserNode = new BrowserNode({
      routerPublicIdentifier,
      supportedChains,
      chainProviders: {
        [supportedChains[0]]: "asdad",
      },
    });
    const depositRes: Result<NodeResponses.Deposit, Error> = Result.ok({
      channelAddress: routerChannelAddress,
    });

    // Act
    when(accountsRepositoryMocks.blockchainProvider.getSigner()).thenReturn(okAsync(signer));
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(browserNode));
    jestWhen(accountsRepositoryMocks.browserNode.prototype.reconcileDeposit)
      .calledWith({
        assetId: assetAddress,
        channelAddress: routerChannelAddress,
      })
      .mockResolvedValue(depositRes);

    // Assert
    expect(
      (await accountsRepositoryMocks.getServiceFactory().depositFunds(assetAddress, amount))._unsafeUnwrap(),
    ).toEqual(null);
  });

  test("Should depositFunds throw error when deposit channelAddress is different from routerChannelAddress", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("43");
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const depositChannelAddress = mockUtils.generateRandomEtherAdress();
    const provider = mockUtils.generateMockProvider();
    const signer = await provider.getSigner();
    const routerPublicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const supportedChains = [2323];
    const browserNode = new BrowserNode({
      routerPublicIdentifier,
      supportedChains,
      chainProviders: {
        [supportedChains[0]]: "asdad",
      },
    });
    const depositRes: Result<NodeResponses.Deposit, Error> = Result.ok({
      channelAddress: depositChannelAddress,
    });
    const throwenError = new Error("Something has gone horribly wrong!");

    // Act
    when(accountsRepositoryMocks.blockchainProvider.getSigner()).thenReturn(okAsync(signer));
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(browserNode));
    jestWhen(accountsRepositoryMocks.browserNode.prototype.reconcileDeposit)
      .calledWith({
        assetId: assetAddress,
        channelAddress: routerChannelAddress,
      })
      .mockResolvedValue(depositRes);

    // Assert
    expect(
      (await accountsRepositoryMocks.getServiceFactory().depositFunds(assetAddress, amount))._unsafeUnwrapErr(),
    ).toStrictEqual(throwenError);
  });

  test("Should withdrawFunds without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("43");
    const destinationAddress = mockUtils.generateRandomEtherAdress();
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const routerPublicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const supportedChains = [2323];
    const browserNode = new BrowserNode({
      routerPublicIdentifier,
      supportedChains,
      chainProviders: {
        [supportedChains[0]]: "asdad",
      },
    });
    const withdrawRes: Result<NodeResponses.Withdraw, Error> = Result.ok({
      channelAddress: routerChannelAddress,
      transferId: mockUtils.generateRandomPaymentId(),
    });

    // Act
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(browserNode));
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));

    jestWhen(accountsRepositoryMocks.browserNode.prototype.withdraw)
      .calledWith({
        channelAddress: routerChannelAddress,
        amount: amount.toString(),
        assetId: assetAddress,
        recipient: destinationAddress,
        fee: "0",
      })
      .mockResolvedValue(withdrawRes);

    // Assert
    expect(
      (
        await accountsRepositoryMocks.getServiceFactory().withdrawFunds(assetAddress, amount, destinationAddress)
      )._unsafeUnwrap(),
    ).toEqual(undefined);
  });

  test("Should withdrawFunds throw error if withdraw fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("43");
    const destinationAddress = mockUtils.generateRandomEtherAdress();
    const routerChannelAddress = mockUtils.generateRandomEtherAdress();
    const routerPublicIdentifier = mockUtils.generateRandomPublicIdentifier();
    const supportedChains = [2323];
    const browserNode = new BrowserNode({
      routerPublicIdentifier,
      supportedChains,
      chainProviders: {
        [supportedChains[0]]: "asdad",
      },
    });
    const throwenError = new RouterChannelUnknownError("Timeout");
    const withdrawRes: Result<NodeResponses.Withdraw, RouterChannelUnknownError> = Result.fail(throwenError);

    // Act
    when(accountsRepositoryMocks.browserNodeProvider.getBrowserNode()).thenReturn(okAsync(browserNode));
    when(accountsRepositoryMocks.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));

    jestWhen(accountsRepositoryMocks.browserNode.prototype.withdraw)
      .calledWith({
        channelAddress: routerChannelAddress,
        amount: amount.toString(),
        assetId: assetAddress,
        recipient: destinationAddress,
        fee: "0",
      })
      .mockResolvedValue(withdrawRes);

    // Assert
    expect(
      (
        await accountsRepositoryMocks.getServiceFactory().withdrawFunds(assetAddress, amount, destinationAddress)
      )._unsafeUnwrapErr(),
    ).toStrictEqual(throwenError);
  });

  test("Should mintTestToken without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const amount = BigNumber.from("43");
    const to = mockUtils.generateRandomEtherAdress();
    const provider = mockUtils.generateMockProvider();
    const signer = await provider.getSigner();

    // Act
    when(accountsRepositoryMocks.blockchainProvider.getSigner()).thenReturn(okAsync(signer));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().mintTestToken(amount, to))._unsafeUnwrap()).toEqual(
      undefined,
    );
  });

  test("Should mintTestToken throw error if getSigner fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const amount = BigNumber.from("43");
    const to = mockUtils.generateRandomEtherAdress();
    const throwenError = new BlockchainUnavailableError();

    // Act
    when(accountsRepositoryMocks.blockchainProvider.getSigner()).thenReturn(errAsync(throwenError));

    // Assert
    expect((await accountsRepositoryMocks.getServiceFactory().mintTestToken(amount, to))._unsafeUnwrapErr()).toEqual(
      throwenError,
    );
  });
});
