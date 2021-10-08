import {
  VectorError,
  BlockchainUnavailableError,
  EthereumAddress,
  AssetBalance,
  Balances,
  IFullChannelState,
  BigNumberString,
  PersistenceError,
  PublicIdentifier,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { IAccountsRepository } from "@interfaces/data/";
import {
  account,
  activeRouters,
  activeStateChannel,
  chainId,
  channelState,
  commonAmount,
  destinationAddress,
  erc20AssetAddress,
  ethereumAddress,
  expirationDate,
  publicIdentifier,
  routerChannelAddress,
  routerPublicIdentifier,
  TransactionResponseMock,
} from "@mock/mocks";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { IStorageUtils } from "@interfaces/data/utilities";
import { IBrowserNodeProvider, IBlockchainUtils } from "@interfaces/utilities";
import {
  BlockchainProviderMock,
  BrowserNodeProviderMock,
  ContextProviderMock,
  VectorUtilsMockFactory,
} from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

class AccountsRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils =
    VectorUtilsMockFactory.factoryVectorUtils(expirationDate);
  public browserNodeProvider = new BrowserNodeProviderMock();
  public logUtils = td.object<ILogUtils>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public storageUtils = td.object<IStorageUtils>();
  public contextProvider = new ContextProviderMock();
  public balances: Balances;
  public stateChannel: IFullChannelState | undefined;

  constructor() {
    td.when(
      this.blockchainUtils.erc20Transfer(
        erc20AssetAddress,
        routerChannelAddress,
        commonAmount,
      ),
    ).thenReturn(okAsync(new TransactionResponseMock()));

    td.when(
      this.blockchainUtils.mintToken(
        td.matchers.argThat((arg: BigNumberString) => {
          return commonAmount == arg;
        }),
        account,
      ),
    ).thenReturn(okAsync(new TransactionResponseMock()));

    td.when(
      this.storageUtils.read<PublicIdentifier[]>("ActiveRouters"),
    ).thenReturn(okAsync(activeRouters));

    this.stateChannel =
      this.browserNodeProvider.stateChannels.get(routerChannelAddress);
    if (this.stateChannel == null) {
      throw new Error();
    }

    this.balances = {
      assets: [
        new AssetBalance(
          routerChannelAddress,
          EthereumAddress(this.stateChannel?.assetIds[0]),
          `Unknown Token (${EthereumAddress(this.stateChannel?.assetIds[0])})`,
          "Unk",
          0,
          BigNumberString(this.stateChannel?.balances[0].amount[1]),
          BigNumberString("0"),
          BigNumberString(this.stateChannel?.balances[0].amount[1]),
        ),
      ],
    };
  }

  public factoryAccountsRepository(): IAccountsRepository {
    return new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
      this.blockchainUtils,
      this.storageUtils,
      this.contextProvider,
      this.logUtils,
    );
  }
}

class AccountsRepositoryErrorMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils =
    VectorUtilsMockFactory.factoryVectorUtils(expirationDate);
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  public logUtils = td.object<ILogUtils>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public storageUtils = td.object<IStorageUtils>();
  public contextProvider = new ContextProviderMock();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(
      errAsync(new VectorError()),
    );
    td.when(
      this.storageUtils.read<PublicIdentifier[]>("ActiveRouters"),
    ).thenReturn(errAsync(new PersistenceError()));
    td.when(
      this.blockchainUtils.mintToken(
        td.matchers.argThat((arg: BigNumberString) => {
          return commonAmount == arg;
        }),
        account,
      ),
    ).thenReturn(errAsync(new BlockchainUnavailableError()));
  }

  public factoryAccountsRepository(): IAccountsRepository {
    return new AccountsRepository(
      this.blockchainProvider,
      this.vectorUtils,
      this.browserNodeProvider,
      this.blockchainUtils,
      this.storageUtils,
      this.contextProvider,
      this.logUtils,
    );
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
    const accounts =
      await accountsRepositoryMocks.blockchainProvider.provider.listAccounts();
    const result = await repo.getAccounts();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getBalances();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toEqual(accountsRepositoryMocks.balances);
  });

  test("Should getBalanceByAsset return balances by asset", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    const assetId = EthereumAddress(
      accountsRepositoryMocks.stateChannel?.assetIds[0] as string,
    );

    // Act
    const result = await repo.getBalanceByAsset(routerChannelAddress, assetId);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(
      accountsRepositoryMocks.balances.assets[0],
    );
  });

  test("Should depositFunds with ether address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.depositFunds(
      routerChannelAddress,
      ethereumAddress,
      commonAmount,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(null);
  });

  test("Should depositFunds with erc20 address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.depositFunds(
      routerChannelAddress,
      erc20AssetAddress,
      commonAmount,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(null);
  });

  test("Should withdrawFunds with ether address without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.withdrawFunds(
      routerChannelAddress,
      ethereumAddress,
      commonAmount,
      destinationAddress,
    );

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
    const result = await repo.withdrawFunds(
      routerChannelAddress,
      erc20AssetAddress,
      commonAmount,
      destinationAddress,
    );

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
    const result = await repo.withdrawFunds(
      routerChannelAddress,
      erc20AssetAddress,
      commonAmount,
      destinationAddress,
    );
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(VectorError);
  });

  test("Should mintTestToken without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.mintTestToken(commonAmount, account);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toBe(undefined);
  });

  test("Should getActiveStateChannels run without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getActiveStateChannels();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual([activeStateChannel]);
  });

  test("Should getActiveStateChannels throw persistance error", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getActiveStateChannels();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(PersistenceError);
  });

  test("Should getActiveRouters run without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getActiveRouters();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(activeRouters);
  });

  test("Should getActiveRouters throw persistance error", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.getActiveRouters();

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(PersistenceError);
  });

  test("Should addActiveRouter run without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.addActiveRouter(routerPublicIdentifier);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(undefined);
  });

  test("Should addActiveRouter throw persistance error", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.addActiveRouter(routerPublicIdentifier);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(PersistenceError);
  });

  test("Should createStateChannel run without errors", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.createStateChannel(
      routerPublicIdentifier,
      chainId,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    expect(result._unsafeUnwrap()).toStrictEqual(channelState.channelAddress);
  });

  test("Should createStateChannel throw VectorError", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.createStateChannel(
      routerPublicIdentifier,
      chainId,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(VectorError);
  });
});
