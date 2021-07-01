import {
  Log,
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import {
  VectorError,
  RouterChannelUnknownError,
  BlockchainUnavailableError,
  EthereumAddress,
  AssetBalance,
  Balances,
  IFullChannelState,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { okAsync, errAsync } from "neverthrow";
import td from "testdouble";

import { AccountsRepository } from "@implementations/data/AccountsRepository";
import { IAccountsRepository } from "@interfaces/data/";
import { IStorageUtils } from "@interfaces/data/utilities";
import {
  IVectorUtils,
  IBrowserNodeProvider,
  IBlockchainProvider,
  IBlockchainUtils,
} from "@interfaces/utilities";
import {
  account,
  account2,
  chainId,
  commonAmount,
  destinationAddress,
  erc20AssetAddress,
  ethereumAddress,
  publicIdentifier,
  routerChannelAddress,
} from "@mock/mocks";
import { BlockchainProviderMock, BrowserNodeProviderMock } from "@mock/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("testdouble-jest")(td, jest);

class TransacationReceiptMock implements TransactionReceipt {
  public to: string;
  public from: string;
  public contractAddress: string;
  public transactionIndex: number;
  public root?: string | undefined;
  public gasUsed: BigNumber;
  public logsBloom: string;
  public blockHash: string;
  public transactionHash: string;
  public logs: Log[];
  public blockNumber: number;
  public confirmations: number;
  public cumulativeGasUsed: BigNumber;
  public byzantium: boolean;
  public status?: number | undefined;
  public effectiveGasPrice: BigNumber;
  public type: number;

  constructor() {
    this.to = account2;
    this.from = account;
    this.contractAddress = ethereumAddress;
    this.transactionIndex = 1;
    this.gasUsed = BigNumber.from(1);
    this.logsBloom = "logsBloom";
    this.blockHash = "blockHash";
    this.transactionHash = "transactionHash";
    this.logs = [];
    this.blockNumber = 1;
    this.confirmations = 1;
    this.cumulativeGasUsed = BigNumber.from(1);
    this.byzantium = false;
    this.effectiveGasPrice = BigNumber.from(1);
    this.type = 0;
  }
}

class TransactionResponseMock implements TransactionResponse {
  public hash: string;
  public blockNumber?: number | undefined;
  public blockHash?: string | undefined;
  public timestamp?: number | undefined;
  public confirmations: number;
  public from: string;
  public raw?: string | undefined;
  public to?: string | undefined;
  public nonce: number;
  public gasLimit: BigNumber;
  public gasPrice: BigNumber;
  public data: string;
  public value: BigNumber;
  public chainId: number;
  public r?: string | undefined;
  public s?: string | undefined;
  public v?: number | undefined;

  constructor() {
    this.hash = "hash";
    this.confirmations = 1;
    this.from = account;
    this.nonce = 0;
    this.gasLimit = BigNumber.from(1);
    this.gasPrice = BigNumber.from(1);
    this.data = "data";
    this.value = BigNumber.from(1);
    this.chainId = chainId;
  }

  public wait(confirmations?: number | undefined): Promise<TransactionReceipt> {
    return Promise.resolve(new TransacationReceiptMock());
  }
}

class AccountsRepositoryMocks {
  public blockchainProvider = new BlockchainProviderMock();
  public vectorUtils = td.object<IVectorUtils>();
  public browserNodeProvider = new BrowserNodeProviderMock();
  public logUtils = td.object<ILogUtils>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public storageUtils = td.object<IStorageUtils>();
  public balances: Balances;
  public stateChannel: IFullChannelState | undefined;

  constructor() {
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(
      okAsync(routerChannelAddress),
    );

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

    this.stateChannel =
      this.browserNodeProvider.stateChannels.get(routerChannelAddress);
    if (this.stateChannel == null) {
      throw new Error();
    }

    this.balances = {
      assets: [
        new AssetBalance(
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
      this.logUtils,
    );
  }
}

class AccountsRepositoryErrorMocks {
  public blockchainProvider = td.object<IBlockchainProvider>();
  public vectorUtils = td.object<IVectorUtils>();
  public browserNodeProvider = td.object<IBrowserNodeProvider>();
  public logUtils = td.object<ILogUtils>();
  public blockchainUtils = td.object<IBlockchainUtils>();
  public storageUtils = td.object<IStorageUtils>();

  constructor() {
    td.when(this.browserNodeProvider.getBrowserNode()).thenReturn(
      errAsync(new VectorError()),
    );
    td.when(this.vectorUtils.getRouterChannelAddress()).thenReturn(
      errAsync(new RouterChannelUnknownError()),
    );
    td.when(this.blockchainProvider.getSigner()).thenReturn(
      errAsync(new BlockchainUnavailableError()),
    );
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

    const assetId = EthereumAddress(
      accountsRepositoryMocks.stateChannel?.assetIds[0] as string,
    );

    // Act
    const result = await repo.getBalanceByAsset(assetId);

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
    const result = await repo.depositFunds(ethereumAddress, commonAmount);

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
    const result = await repo.depositFunds(erc20AssetAddress, commonAmount);

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

  test("Should mintTestToken throw error if getSigner fails", async () => {
    // Arrange
    const accountsRepositoryMocks = new AccountsRepositoryErrorMocks();
    const repo = accountsRepositoryMocks.factoryAccountsRepository();

    // Act
    const result = await repo.mintTestToken(commonAmount, account);
    const error = result._unsafeUnwrapErr();

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(error).toBeInstanceOf(BlockchainUnavailableError);
  });
});
