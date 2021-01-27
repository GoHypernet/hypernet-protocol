import { when, verify } from "ts-mockito";
import { mkPublicIdentifier } from "@connext/vector-utils";
import { Subject } from "rxjs";

import { Balances, BigNumber, AssetBalance } from "@interfaces/objects";
import AccountServiceMocks from "@mock/business/AccountServiceMocks";
import { mockUtils } from "@mock/mocks";
import { okAsync } from "neverthrow";

describe("AccountService tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountServiceFactory = accountServiceMock.factoryService();
    const publicIdentifier = mkPublicIdentifier();

    when(accountServiceMock.accountRepository.getPublicIdentifier()).thenReturn(okAsync(publicIdentifier));

    // Act
    const getPublicIdentifierResponse = await accountServiceFactory.getPublicIdentifier();

    // Assert
    expect(getPublicIdentifierResponse.isErr()).toStrictEqual(false);
    expect(getPublicIdentifierResponse._unsafeUnwrap()).toStrictEqual(publicIdentifier);
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountServiceFactory = accountServiceMock.factoryService();
    const accounts = [mockUtils.generateRandomEtherAdress()];

    when(accountServiceMock.accountRepository.getAccounts()).thenReturn(okAsync(accounts));

    // Act
    const getAccountsResponse = await accountServiceFactory.getAccounts();

    // Assert
    expect(getAccountsResponse.isErr()).toStrictEqual(false);
    expect(getAccountsResponse._unsafeUnwrap()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountServiceFactory = accountServiceMock.factoryService();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));

    // Act
    const getBalancesResponse = await accountServiceFactory.getBalances();

    // Assert
    expect(getBalancesResponse.isErr()).toStrictEqual(false);
    expect(getBalancesResponse._unsafeUnwrap().assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(getBalancesResponse._unsafeUnwrap().assets[0].totalAmount).toStrictEqual(amount);
  });

  test("Should depositFunds call accountRepository.depositFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountServiceFactory = accountServiceMock.factoryService();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    const hypernetContext = accountServiceMock.getHypernetContextFactory();
    hypernetContext.onBalancesChanged = new Subject<Balances>();

    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));
    when(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).thenReturn(okAsync(null));
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(accountServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));

    // Act
    const depositFundsResponse = await accountServiceFactory.depositFunds(assetAddress, amount);

    // Assert
    verify(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).twice();
    expect(depositFundsResponse.isErr()).toStrictEqual(false);
    expect(depositFundsResponse._unsafeUnwrap().assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(depositFundsResponse._unsafeUnwrap().assets[0].freeAmount).toStrictEqual(amount);
  });

  test("Should withdrawFunds call accountRepository.withdrawFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accountServiceFactory = accountServiceMock.factoryService();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const destinationAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));
    when(accountServiceMock.contextProvider.getInitializedContext()).thenReturn(
      okAsync(accountServiceMock.getInitializedHypernetContextFactory()),
    );
    when(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).thenReturn(okAsync(null));
    when(accountServiceMock.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).thenReturn(
      okAsync(undefined),
    );
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());

    // Act
    const withdrawFundsResponse = await accountServiceFactory.withdrawFunds(assetAddress, amount, destinationAddress);

    // Assert
    verify(accountServiceMock.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).once();
    expect(withdrawFundsResponse.isErr()).toStrictEqual(false);
    expect(withdrawFundsResponse._unsafeUnwrap().assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(withdrawFundsResponse._unsafeUnwrap().assets[0].freeAmount).toStrictEqual(amount);
  });
});
