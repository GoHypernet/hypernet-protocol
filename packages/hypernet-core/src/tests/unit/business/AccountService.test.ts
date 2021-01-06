import { mock, instance, when, verify } from "ts-mockito";
import { mkPublicIdentifier } from "@connext/vector-utils";
import { Subject } from "rxjs";

import { Balances, BigNumber, InitializedHypernetContext, AssetBalance } from "@interfaces/objects";
import { AccountService } from "@implementations/business";
import { AccountsRepository } from "@implementations/data";
import { ContextProvider } from "@implementations/utilities";

let accountRepository: AccountsRepository;
let accountRepositoryInstance: AccountsRepository;

let contextProvider: ContextProvider;
let contextProviderInstance: ContextProvider;

let service: AccountService;

describe("AccountService tests", () => {
  beforeEach(() => {
    // Arrange
    accountRepository = mock(AccountsRepository);
    accountRepositoryInstance = instance(accountRepository);

    contextProvider = mock(ContextProvider);
    contextProviderInstance = instance(contextProvider);

    service = new AccountService(accountRepositoryInstance, contextProviderInstance);
  });

  test("Should getPublicIdentifier return publicIdentifier", async () => {
    // Arrange
    const publicIdentifier = mkPublicIdentifier();

    // Act
    when(accountRepository.getPublicIdentifier()).thenResolve(publicIdentifier);

    // Assert
    expect(await service.getPublicIdentifier()).toStrictEqual(publicIdentifier);
  });

  test("Should getAccounts return accounts", async () => {
    // Arrange
    const accounts = ["acount1"];

    // Act
    when(accountRepository.getAccounts()).thenResolve(accounts);

    // Assert
    expect(await service.getAccounts()).toStrictEqual(accounts);
  });

  test("Should getBalances return balances", async () => {
    // Arrange
    const assetAddress = "assetAddress";
    const amount = BigNumber.from("42");

    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);

    // Act
    when(accountRepository.getBalances()).thenResolve(balances);
    const serviceResponse = await service.getBalances();

    // Assert
    expect(serviceResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(serviceResponse.assets[0].totalAmount).toStrictEqual(amount);
  });

  test("Should depositFunds call accountRepository.depositFunds ones and return balances", async () => {
    // Arrange
    const initializedHypernetContext = mock(InitializedHypernetContext);
    const initializedHypernetContextInstance = instance(initializedHypernetContext);

    const assetAddress = "assetAddress";
    const amount = BigNumber.from("42");

    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);
    // Act
    when(accountRepository.getBalances()).thenResolve(balances);
    when(initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(contextProvider.getInitializedContext()).thenResolve(initializedHypernetContextInstance);

    const depositFundsResponse = await service.depositFunds(assetAddress, amount);

    // Assert
    verify(accountRepository.depositFunds(assetAddress, amount)).once();
    expect(depositFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(depositFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });

  test("Should withdrawFunds call accountRepository.withdrawFunds ones and return balances", async () => {
    // Arrange
    const initializedHypernetContext = mock(InitializedHypernetContext);
    const initializedHypernetContextInstance = instance(initializedHypernetContext);

    const assetAddress = "assetAddress";
    const destinationAddress = "destinationAddress";
    const amount = BigNumber.from("42");

    const balances = new Balances([new AssetBalance(assetAddress, amount, amount, amount)]);
    // Act
    when(accountRepository.getBalances()).thenResolve(balances);
    when(initializedHypernetContext.onBalancesChanged).thenReturn(new Subject<Balances>());
    when(contextProvider.getInitializedContext()).thenResolve(initializedHypernetContextInstance);

    const depositFundsResponse = await service.withdrawFunds(assetAddress, amount, destinationAddress);

    // Assert
    verify(accountRepository.withdrawFunds(assetAddress, amount, destinationAddress)).once();
    expect(depositFundsResponse.assets[0].assetAddresss).toStrictEqual(assetAddress);
    expect(depositFundsResponse.assets[0].freeAmount).toStrictEqual(amount);
  });
});
