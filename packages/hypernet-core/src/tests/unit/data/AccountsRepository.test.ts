import td from "testdouble";
import {
  commonAmount,
  destinationAddress,
  erc20AssetAddress,
  ethereumAddress,
  publicIdentifier,
  routerChannelAddress,
} from "@mock/mocks";
import { BlockchainProviderMock, BrowserNodeProviderMock } from "@mock/utils";
import { ILogUtils, IVectorUtils, IBrowserNodeProvider } from "@interfaces/utilities";
import { AssetBalance, BigNumber, Balances } from "@interfaces/objects";
import { VectorError, RouterChannelUnknownError, BlockchainUnavailableError } from "@interfaces/objects/errors";
import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { okAsync, ok, err, errAsync } from "neverthrow";

class AccountsRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(okAsync(routerChannelAddress));
  }

  public factoryAccountsRepository(): IAccountsRepository {
    return new AccountsRepository(this.blockchainProvider, this.vectorUtils, this.browserNodeProvider, this.logUtils);
  }
}

class AccountsRepositoryErrorMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  public logUtils = td.object<ILogUtils>();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(errAsync(new VectorError()));
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(errAsync(new RouterChannelUnknownError()));
  }

  public factoryAccountsRepository(): IAccountsRepository {
    return new AccountsRepository(this.blockchainProvider, this.vectorUtils, this.browserNodeProvider, this.logUtils);
  }
}

describe("AccountsRepository tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getPublicIdentifier();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(publicIdentifier);
  });

  test("Should getPublicIdentifier throw error", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getPublicIdentifier();
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const accounts = await accountsRepositoryMocks.blockchainProvider.provider.listAccounts();
    const result = await repo.getAccounts();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(accounts);
  });

  // TODO: there is a bug in getBalances related to contract token names, refactor this test when it fixed
  test("Should getBalances return balances", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    const stateChannel = accountsRepositoryMocks.browserNodeProvider.stateChannels.get(routerChannelAddress);
    const balances: Balances = {
      assets: [
        new AssetBalance(
          stateChannel?.assetIds[0] as string,
          "",
          "",
          0,
          BigNumber.from(stateChannel?.balances[0].amount[1]),
          BigNumber.from(0),
          BigNumber.from(stateChannel?.balances[0].amount[1]),
        ),
      ],
    };

    // Act
    const result = await repo.getBalances();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toEqual(balances);
  });

  test("Should getBalances throw error when getRouterChannelAddress fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getBalances();
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(RouterChannelUnknownError);
  });

  test("Should getBalanceByAsset return balances by asset", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    const stateChannel = accountsRepositoryMocks.browserNodeProvider.stateChannels.get(routerChannelAddress);
    const assetId = stateChannel?.assetIds[0] as string;
    const assetBalance = new AssetBalance(
      assetId,
      "",
      "",
      0,
      BigNumber.from(stateChannel?.balances[0].amount[1]),
      BigNumber.from(0),
      BigNumber.from(stateChannel?.balances[0].amount[1]),
    );

    // Act
    const result = await repo.getBalanceByAsset(assetId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(assetBalance);
  });

  test("Should depositFunds with ether address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.depositFunds(ethereumAddress, commonAmount);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(null);
  });

  // TODO: this test is failing because Contract cannot be mocked in accountsRepository, Contract needs to be as class provider
  /* test("Should depositFunds with erc20 address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.depositFunds(erc20AssetAddress, commonAmount);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(null);
  }); */

  test("Should withdrawFunds with ether address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.withdrawFunds(ethereumAddress, commonAmount, destinationAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(undefined);
  });

  test("Should withdrawFunds with erc20 address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.withdrawFunds(erc20AssetAddress, commonAmount, destinationAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(undefined);
  });

  test("Should withdrawFunds throw error if withdraw fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.withdrawFunds(erc20AssetAddress, commonAmount, destinationAddress);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  // TODO: this test is failing because Contract cannot be mocked in accountsRepository, Contract needs to be as class provider
  /* test("Should mintTestToken without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.mintTestToken(commonAmount, ethereumAddress);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(undefined);
  }); 
  
  test("Should mintTestToken throw error if getSigner fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.mintTestToken(commonAmount, ethereumAddress);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(BlockchainUnavailableError);
  });*/
});
