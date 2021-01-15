import { when, verify } from "ts-mockito";
import { mkPublicIdentifier } from "@connext/vector-utils";
import { Subject } from "rxjs";

import { Balances, BigNumber, AssetBalance } from "@interfaces/objects";
import AccountServiceMocks from "../../mock/business/AccountServiceMocks";
import { mockUtils } from "../../mock/utils";
import { okAsync } from "neverthrow";

describe("AccountService tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const publicIdentifier = mkPublicIdentifier();

    // Act
    when(accountServiceMock.accountRepository.getPublicIdentifier()).thenReturn(okAsync(publicIdentifier));

    // Assert
    expect((await accountServiceMock.getServiceFactory().getPublicIdentifier())._unsafeUnwrap()).toStrictEqual(
      publicIdentifier,
    );
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accounts = [mockUtils.generateRandomEtherAdress()];

    // Act
    when(accountServiceMock.accountRepository.getAccounts()).thenReturn(okAsync(accounts));

    // Assert
    expect((await accountServiceMock.getServiceFactory().getAccounts())._unsafeUnwrap()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));
    const serviceResponse = (await accountServiceMock.getServiceFactory().getBalances())._unsafeUnwrap();

    // Assert
    expect(serviceResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(serviceResponse.assets[0].totalAmount).toStrictEqual(amount);
  });

  test("Should depositFunds call accountRepository.depositFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();

    const assetAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    const hypernetContext = accountServiceMock.getHypernetContextFactory();
    hypernetContext.onBalancesChanged = new Subject<Balances>();

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));
    when(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).thenReturn(okAsync(null));
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(accountServiceMock.contextProvider.getContext()).thenReturn(okAsync(hypernetContext));
    const depositFundsResponse = (
      await accountServiceMock.getServiceFactory().depositFunds(assetAddress, amount)
    )._unsafeUnwrap();

    // Assert
    verify(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).twice();
    expect(depositFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(depositFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });

  test("Should withdrawFunds call accountRepository.withdrawFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();

    const assetAddress = mockUtils.generateRandomEtherAdress();
    const destinationAddress = mockUtils.generateRandomEtherAdress();
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenReturn(okAsync(balances));
    when(accountServiceMock.contextProvider.getInitializedContext()).thenReturn(
      okAsync(accountServiceMock.getInitializedHypernetContextFactory()),
    );
    when(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).thenReturn(okAsync(null));
    when(accountServiceMock.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).thenReturn(
      okAsync(undefined),
    );
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());

    const withdrawFundsResponse = (
      await accountServiceMock.getServiceFactory().withdrawFunds(assetAddress, amount, destinationAddress)
    )._unsafeUnwrap();

    // Assert
    verify(accountServiceMock.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).once();
    expect(withdrawFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(withdrawFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });
});
