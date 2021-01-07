import { when, verify } from "ts-mockito";
import { mkPublicIdentifier } from "@connext/vector-utils";
import { Subject } from "rxjs";

import { Balances, BigNumber, AssetBalance } from "@interfaces/objects";
import AccountServiceMocks from "../../mock/unit/business/AccountServiceMocks";

var randomstring = require("randomstring");

describe("AccountService tests", () => {
  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const publicIdentifier = mkPublicIdentifier();

    // Act
    when(accountServiceMock.accountRepository.getPublicIdentifier()).thenResolve(publicIdentifier);

    // Assert
    expect(await accountServiceMock.getServiceFactory().getPublicIdentifier()).toStrictEqual(publicIdentifier);
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const accounts = ["0x" + randomstring.generate({ length: 40, charset: "hex" })];

    // Act
    when(accountServiceMock.accountRepository.getAccounts()).thenResolve(accounts);

    // Assert
    expect(await accountServiceMock.getServiceFactory().getAccounts()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();
    const assetAddress = "0x" + randomstring.generate({ length: 40, charset: "hex" });
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenResolve(balances);
    const serviceResponse = await accountServiceMock.getServiceFactory().getBalances();

    // Assert
    expect(serviceResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(serviceResponse.assets[0].totalAmount).toStrictEqual(amount);
  });

  test("Should depositFunds call accountRepository.depositFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();

    const assetAddress = "0x" + randomstring.generate({ length: 40, charset: "hex" });
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenResolve(balances);
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(accountServiceMock.contextProvider.getInitializedContext()).thenResolve(
      accountServiceMock.getInitializedHypernetContextFactory(),
    );

    const depositFundsResponse = await accountServiceMock.getServiceFactory().depositFunds(assetAddress, amount);

    // Assert
    verify(accountServiceMock.accountRepository.depositFunds(assetAddress, amount)).once();
    expect(depositFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(depositFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });

  test("Should withdrawFunds call accountRepository.withdrawFunds ones and return balances", async () => {
    // Arrange
    const accountServiceMock = new AccountServiceMocks();

    const assetAddress = "0x" + randomstring.generate({ length: 40, charset: "hex" });
    const destinationAddress = "0x" + randomstring.generate({ length: 40, charset: "hex" });
    const amount = BigNumber.from("42");
    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountServiceMock.accountRepository.getBalances()).thenResolve(balances);
    when(accountServiceMock.initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(accountServiceMock.contextProvider.getInitializedContext()).thenResolve(
      accountServiceMock.getInitializedHypernetContextFactory(),
    );

    const withdrawFundsResponse = await accountServiceMock
      .getServiceFactory()
      .withdrawFunds(assetAddress, amount, destinationAddress);

    // Assert
    verify(accountServiceMock.accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).once();
    expect(withdrawFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(withdrawFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });
});
