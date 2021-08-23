import {
  Balances,
  EthereumAddress,
  InvalidParametersError,
  PrivateCredentials,
  PublicIdentifier,
  BalancesUnavailableError,
  BlockchainUnavailableError,
  VectorError,
  Signature,
  BigNumberString,
  ActiveStateChannel,
  PersistenceError,
  ChainId,
} from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { IAccountService } from "@interfaces/business";
import { IAccountsRepository } from "@interfaces/data";
import {
  HypernetContext,
  InitializedHypernetContext,
} from "@interfaces/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IContextProvider, IBlockchainProvider } from "@interfaces/utilities";

/**
 *
 */
export class AccountService implements IAccountService {
  constructor(
    protected accountRepository: IAccountsRepository,
    protected contextProvider: IContextProvider,
    protected blockchainProvider: IBlockchainProvider,
    protected logUtils: ILogUtils,
  ) {}

  public getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  > {
    return this.accountRepository.getPublicIdentifier();
  }

  public getAccounts(): ResultAsync<
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.accountRepository.getAccounts();
  }

  public getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError
  > {
    return this.contextProvider.getInitializedContext().map((context) => {
      return context.activeStateChannels;
    });
  }

  public createStateChannel(
    routerPublicIdentifiers: PublicIdentifier[],
    chainId: ChainId,
  ): ResultAsync<
    ActiveStateChannel,
    BlockchainUnavailableError | VectorError | PersistenceError
  > {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      // Check if we have an existing state channel that matches these parameters.
      const existingStateChannel = context.activeStateChannels.find((asc) => {
        return (
          asc.chainId == chainId &&
          routerPublicIdentifiers.includes(asc.routerPublicIdentifier)
        );
      });

      if (existingStateChannel == null) {
        // No existing channel; we need to create it.
        // Choose one of the routers at random.
        const routerPublicIdentifier =
          routerPublicIdentifiers[
            Math.floor(Math.random() * routerPublicIdentifiers.length)
          ];

        return this.accountRepository
          .createStateChannel(routerPublicIdentifier, chainId)
          .andThen((channelAddress) => {
            return this.accountRepository
              .addActiveRouter(routerPublicIdentifier)
              .andThen(() => {
                // We need to add the new state channel to the context
                context.activeStateChannels.push(
                  new ActiveStateChannel(
                    chainId,
                    routerPublicIdentifier,
                    channelAddress,
                  ),
                );
                return this.contextProvider.setContext(context);
              })
              .map(() => {
                return new ActiveStateChannel(
                  chainId,
                  routerPublicIdentifier,
                  channelAddress,
                );
              });
          });
      } else {
        // State channel with one of these routers already exists, return it!
        return okAsync(existingStateChannel);
      }
    });
  }

  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError
  > {
    return this.accountRepository.getBalances();
  }

  public depositFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError
  > {
    this.logUtils.log(
      `HypernetCore:depositFunds: assetAddress: ${assetAddress}`,
    );

    let context: HypernetContext;

    return this.contextProvider
      .getContext()
      .andThen((contextVal) => {
        context = contextVal;

        return this.accountRepository.depositFunds(
          channelAddress,
          assetAddress,
          amount,
        );
      })
      .andThen(() => {
        return this.accountRepository.getBalances();
      })
      .andThen((balances) => {
        context.onBalancesChanged.next(balances);

        return okAsync(balances);
      });
  }

  public withdrawFunds(
    channelAddress: EthereumAddress,
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    Balances,
    BalancesUnavailableError | BlockchainUnavailableError | VectorError
  > {
    let context: InitializedHypernetContext;

    return this.contextProvider
      .getInitializedContext()
      .andThen((contextVal) => {
        context = contextVal;
        return this.accountRepository.withdrawFunds(
          channelAddress,
          assetAddress,
          amount,
          destinationAddress,
        );
      })
      .andThen(() => {
        return this.accountRepository.getBalances();
      })
      .andThen((balances) => {
        context.onBalancesChanged.next(balances);

        return okAsync(balances);
      });
  }

  public providePrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError> {
    if (!privateCredentials.mnemonic && !privateCredentials.privateKey) {
      return errAsync(
        new InvalidParametersError(
          "You must provide a mnemonic or private key",
        ),
      );
    }

    return this.blockchainProvider.supplyPrivateCredentials(privateCredentials);
  }

  public signMessage(
    message: string,
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError> {
    return this.accountRepository.signMessage(message);
  }
}
