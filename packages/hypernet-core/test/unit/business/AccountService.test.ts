import { Balances, AssetBalance, BigNumberString } from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { AccountService } from "@implementations/business/AccountService";
import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import { IBlockchainProvider } from "@interfaces/utilities";
import { account, mockUtils, publicIdentifier } from "@mock/mocks";
import { ContextProviderMock } from "@mock/utils";

const assetAddress = mockUtils.generateRandomEtherAdress();
const destinationAddress = mockUtils.generateRandomEtherAdress();
const amount = BigNumberString("42");

class AccountServiceMocks {
  public accountRepository = td.object<IAccountsRepository>();
  public blockchainProvider = td.object<IBlockchainProvider>();
  public contextProvider = new ContextProviderMock();
  public logUtils = td.object<ILogUtils>();
  public balances: Balances;

  constructor() {
    this.balances = new Balances([
      new AssetBalance(
        assetAddress,
        "PhoebeCoin",
        "BEEP",
        4,
        amount,
        amount,
        amount,
      ),
    ]);

    td.when(this.accountRepository.getPublicIdentifier()).thenReturn(
      okAsync(publicIdentifier),
    );
    td.when(
      this.accountRepository.depositFunds(assetAddress, amount),
    ).thenReturn(okAsync(null));
    td.when(
      this.accountRepository.withdrawFunds(
        assetAddress,
        amount,
        destinationAddress,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(this.accountRepository.getBalances()).thenReturn(
      okAsync(this.balances),
    );
  }

  public factoryAccountService(): IAccountService {
    return new AccountService(
      this.accountRepository,
      this.contextProvider,
      this.blockchainProvider,
      this.logUtils,
    );
  }
}

const assetName = "PhoebeCoin";
const assetSymbol = ":P";

describe("AccountService tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountService = accountServiceMock.factoryAccountService();

    // Act
    const getPublicIdentifierResponse = await accountService.getPublicIdentifier();

    // Assert
    expect(getPublicIdentifierResponse.isErr()).toStrictEqual(false);
    expect(getPublicIdentifierResponse._unsafeUnwrap()).toStrictEqual(
      publicIdentifier,
    );
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountService = accountServiceMock.factoryAccountService();
    const accounts = [account];

    td.when(accountServiceMock.accountRepository.getAccounts()).thenReturn(
      okAsync(accounts),
    );

    // Act
    const getAccountsResponse = await accountService.getAccounts();

    // Assert
    expect(getAccountsResponse.isErr()).toStrictEqual(false);
    expect(getAccountsResponse._unsafeUnwrap()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountService = accountServiceMock.factoryAccountService();

    // Act
    const getBalancesResponse = await accountService.getBalances();

    // Assert
    expect(getBalancesResponse.isErr()).toStrictEqual(false);
    expect(getBalancesResponse._unsafeUnwrap()).toStrictEqual(
      accountServiceMock.balances,
    ); // There's no logic between what the repo returns and what the service returns, so we only need to verify that we get the object we made the repo return. It's strucutre is unimportant.
  });

  test("Should depositFunds call accountRepository.depositFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountService = accountServiceMock.factoryAccountService();

    const publishedBalances = new Array<Balances>();
    accountServiceMock.contextProvider.onBalancesChanged.subscribe((val) => {
      publishedBalances.push(val);
    });

    // Act
    const response = await accountService.depositFunds(assetAddress, amount);

    // Assert
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(accountServiceMock.balances);
    expect(publishedBalances.length).toBe(1);
    expect(publishedBalances[0]).toBe(accountServiceMock.balances);
  });

  test("Should withdrawFunds call accountRepository.withdrawFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountService = accountServiceMock.factoryAccountService();

    const publishedBalances = new Array<Balances>();
    accountServiceMock.contextProvider.onBalancesChanged.subscribe((val) => {
      publishedBalances.push(val);
    });

    // Act
    const response = await accountService.withdrawFunds(
      assetAddress,
      amount,
      destinationAddress,
    );

    // Assert
    expect(response.isErr()).toBeFalsy();
    expect(response._unsafeUnwrap()).toBe(accountServiceMock.balances);
    expect(publishedBalances.length).toBe(1);
    expect(publishedBalances[0]).toBe(accountServiceMock.balances);
  });
});
