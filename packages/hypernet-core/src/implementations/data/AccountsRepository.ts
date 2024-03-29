import { DEFAULT_CHANNEL_TIMEOUT, ERC20Abi } from "@connext/vector-types";
import {
  AssetBalance,
  Balances,
  EthereumAddress,
  PublicIdentifier,
  IFullChannelState,
  Signature,
  AssetInfo,
  BlockchainUnavailableError,
  BalancesUnavailableError,
  LogicalError,
  VectorError,
  BigNumberString,
  ActiveStateChannel,
  ChainId,
  PersistenceError,
  UtilityMessageSignature,
  EthereumContractAddress,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IAccountsRepository } from "@interfaces/data";
import { ethers, constants, BigNumber, Contract } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
import {
  IVectorUtils,
  IBlockchainProvider,
  IBrowserNodeProvider,
  IBlockchainUtils,
  IContextProvider,
  IBlockchainProviderType,
  IVectorUtilsType,
  IBrowserNodeProviderType,
  IBlockchainUtilsType,
  IContextProviderType,
} from "@interfaces/utilities";

/**
 * Contains methods for getting Ethereum accounts, public identifiers,
 * state channels, balances for accounts, and depositing & withdrawing assets.
 */
@injectable()
export class AccountsRepository implements IAccountsRepository {
  /**
   * Retrieves an instances of the AccountsRepository.
   */
  protected assetInfo: Map<EthereumContractAddress, AssetInfo>;
  protected erc20Abi: string[];
  protected activeRoutersKey = "ActiveRouters";

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IBrowserNodeProviderType)
    protected browserNodeProvider: IBrowserNodeProvider,
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    // We will cache the info about each asset type, so we only have to look it up once.
    this.assetInfo = new Map();

    // Add a default entry for Ethereum, it's not an ERC20, it's special and it's also universal.
    this.assetInfo.set(
      EthereumContractAddress(constants.AddressZero),
      new AssetInfo(
        EthereumContractAddress(constants.AddressZero),
        "Ethereum",
        "ETH",
        18,
      ),
    );

    this.erc20Abi = Object.assign([], ERC20Abi);
    this.erc20Abi.push("function name() view returns (string)");
  }

  public getActiveRouters(): ResultAsync<
    PublicIdentifier[],
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.storageUtils
      .read<PublicIdentifier[]>(this.activeRoutersKey)
      .map((activeRouters) => {
        if (activeRouters == null) {
          return [];
        }
        return activeRouters;
      });
  }

  public addActiveRouter(
    routerPublicIdentifier: PublicIdentifier,
  ): ResultAsync<
    void,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    return this.getActiveRouters().andThen((activeRouters) => {
      if (activeRouters == null) {
        activeRouters = [];
      }

      // Check if this router is already in our active list
      const existingActiveRouter = activeRouters.find((ar) => {
        return ar == routerPublicIdentifier;
      });

      if (existingActiveRouter == null) {
        activeRouters.push(routerPublicIdentifier);
        return this.storageUtils
          .write(this.activeRoutersKey, activeRouters)
          .orElse((e) => {
            this.logUtils.error(
              e.message || "addActiveRouter storage write not working!",
            );
            return okAsync(undefined);
          });
      }
      return okAsync(undefined);
    });
  }

  public getActiveStateChannels(): ResultAsync<
    ActiveStateChannel[],
    VectorError | BlockchainUnavailableError | PersistenceError
  > {
    // Need to retrieve the list of active routers from the persistence store
    return ResultUtils.combine([
      this.getActiveRouters(),
      this.browserNodeProvider.getBrowserNode(),
    ]).andThen((vals) => {
      const [activeRouters, browserNode] = vals;
      if (activeRouters == null) {
        return okAsync([]);
      }
      return browserNode
        .getStateChannels()
        .andThen((channelAddresses) => {
          const channelRequests = channelAddresses.map((channelAddress) => {
            return browserNode.getStateChannel(channelAddress);
          });

          return ResultUtils.combine(channelRequests);
        })
        .map((fullChannelStates) => {
          return fullChannelStates
            .filter((val) => {
              return val != null;
            })
            .map((fullChannelState) => {
              if (fullChannelState == null) {
                throw new Error(
                  "Something deeply screwed up in getActiveStateChannels",
                );
              }
              return new ActiveStateChannel(
                ChainId(fullChannelState.networkContext.chainId),
                PublicIdentifier(fullChannelState.aliceIdentifier),
                EthereumContractAddress(fullChannelState.channelAddress),
              );
            });
        });
    });
  }

  public createStateChannel(
    routerPublicIdentifier: PublicIdentifier,
    chainId: ChainId,
  ): ResultAsync<
    EthereumContractAddress,
    PersistenceError | VectorError | BlockchainUnavailableError
  > {
    // Make sure we don't already have a state channel like this setup
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.browserNodeProvider.getBrowserNode(),
    ]).andThen((vals) => {
      const [context, browserNode] = vals;
      const existingStateChannel = context.activeStateChannels?.find((asc) => {
        return (
          asc.chainId == chainId &&
          asc.routerPublicIdentifier == routerPublicIdentifier
        );
      });

      if (existingStateChannel != null) {
        return okAsync<EthereumContractAddress, VectorError>(
          existingStateChannel.channelAddress,
        );
      }

      // No existing state channel, we need to create it.
      return browserNode
        .setup(
          routerPublicIdentifier,
          chainId,
          DEFAULT_CHANNEL_TIMEOUT.toString(),
        )
        .map((response) => {
          return EthereumContractAddress(response.channelAddress);
        })
        .orElse((e) => {
          // Channel could be already set up, so we should try restoring the state
          this.logUtils.warning(
            "Channel setup with router failed, attempting to restore state and retry",
          );
          return browserNode
            .restoreState(routerPublicIdentifier, chainId)
            .andThen(() => {
              return browserNode.getStateChannelByParticipants(
                routerPublicIdentifier,
                chainId,
              );
            })
            .andThen((channel) => {
              if (channel == null) {
                return errAsync(e);
              }
              return okAsync<EthereumContractAddress, VectorError>(
                EthereumContractAddress(channel.channelAddress),
              );
            });
        });
    });
  }

  /**
   * Get the current public identifier for this instance.
   */
  public getPublicIdentifier(): ResultAsync<
    PublicIdentifier,
    BlockchainUnavailableError | VectorError
  > {
    return this.browserNodeProvider.getBrowserNode().map((browserNode) => {
      return browserNode.publicIdentifier;
    });
  }

  /**
   * Get the Ethereum accounts associated with this instance.
   */
  public getAccounts(): ResultAsync<
    EthereumAccountAddress[],
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.listAccounts(), (e) => {
        return new BlockchainUnavailableError(
          "Unable to get accounts from blockchain provider",
          e,
        );
      }).map((addresses) => {
        return addresses.map((val) => EthereumAccountAddress(val));
      });
    });
  }

  /**
   * Get all balances associated with this instance.
   */
  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | BlockchainUnavailableError
  > {
    return ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.contextProvider.getInitializedContext(),
    ])
      .andThen((vals) => {
        const [browserNode, context] = vals;

        return ResultUtils.combine(
          context.activeStateChannels.map((activeStateChannel) => {
            return browserNode.getStateChannel(
              activeStateChannel.channelAddress,
            );
          }),
        );
      })
      .andThen((channelStates) => {
        const assetBalanceResults = new Array<
          ResultAsync<AssetBalance, VectorError | BlockchainUnavailableError>
        >();

        return ResultUtils.combine(
          channelStates.map((channelState) => {
            if (channelState == null) {
              return okAsync<
                AssetBalance[],
                VectorError | BlockchainUnavailableError
              >([]);
            }
            for (let i = 0; i < channelState.assetIds.length; i++) {
              const assetBalanceResult = this._getAssetBalance(i, channelState);
              assetBalanceResults.push(assetBalanceResult);
            }

            return ResultUtils.combine(assetBalanceResults);
          }),
        );
      })
      .map((assetBalances) => {
        return new Balances(new Array<AssetBalance>().concat(...assetBalances));
      });
  }

  /**
   * Get balance for a particular asset for this instance
   * @param assetAddress the (Ethereum) address of the token to get the balance of
   */
  public getBalanceByAsset(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
  ): ResultAsync<
    AssetBalance,
    BalancesUnavailableError | VectorError | BlockchainUnavailableError
  > {
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.getStateChannel(channelAddress);
      })
      .andThen((stateChannel) => {
        const index = stateChannel?.assetIds?.findIndex(
          (assetId) => assetId == assetAddress,
        );

        if (stateChannel != null && index != null && index != -1) {
          return this._getAssetBalance(index, stateChannel);
        } else {
          return this._getAssetInfo(assetAddress).map((assetInfo) => {
            return new AssetBalance(
              channelAddress,
              assetAddress,
              assetInfo.name,
              assetInfo.symbol,
              assetInfo.decimals,
              BigNumberString("0"),
              BigNumberString("0"),
              BigNumberString("0"),
            );
          });
        }
      });
  }

  /**
   * Deposit funds into this instance of Hypernet Core
   * @param assetAddress the (Ethereum) token address to deposit
   * @param amount the amount of the token to deposit
   */
  public depositFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
  ): ResultAsync<null, VectorError | BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.blockchainProvider.getSigner(),
      this.browserNodeProvider.getBrowserNode(),
    ]).andThen((vals) => {
      const [signer, browserNode] = vals;
      let transferResult: ResultAsync<
        ethers.providers.TransactionResponse,
        BlockchainUnavailableError
      >;

      if (assetAddress === "0x0000000000000000000000000000000000000000") {
        this.logUtils.log("Transferring ETH.");
        // send eth
        transferResult = ResultAsync.fromPromise(
          signer.sendTransaction({
            to: channelAddress,
            value: BigNumber.from(amount),
          }),
          (err) => {
            return new BlockchainUnavailableError(
              "Unable to send transaction",
              err,
            );
          },
        );
      } else {
        this.logUtils.log("Transferring an ERC20 asset.");
        // send an actual erc20 token
        transferResult = this.blockchainUtils.erc20Transfer(
          assetAddress,
          channelAddress,
          amount,
        );
      }

      return transferResult
        .andThen((tx) => {
          // TODO: Wait on this, break it up, this could take a while
          return ResultAsync.fromPromise(
            tx.wait(),
            (e) => e as BlockchainUnavailableError,
          );
        })
        .andThen(() => {
          if (browserNode == null || channelAddress == null) {
            throw new LogicalError("Really screwed up!");
          }
          return browserNode.reconcileDeposit(assetAddress, channelAddress);
        })
        .andThen((depositChannelAddress) => {
          // Sanity check, the deposit was for the channel we tried to deposit into.
          if (depositChannelAddress !== channelAddress) {
            throw new LogicalError("Something has gone horribly wrong!");
          }

          return okAsync(null);
        });
    });
  }

  /**
   * Withdraw funds from this instance of Hypernet Core to a specified (Ethereum) destination
   * @param assetAddress the token address to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the destination (Ethereum) address to withdraw to
   */
  public withdrawFunds(
    channelAddress: EthereumContractAddress,
    assetAddress: EthereumContractAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAccountAddress,
  ): ResultAsync<void, VectorError | BlockchainUnavailableError> {
    return this.browserNodeProvider
      .getBrowserNode()
      .andThen((browserNode) => {
        return browserNode.withdraw(
          channelAddress,
          amount,
          assetAddress,
          destinationAddress,
        );
      })
      .map(() => {
        return;
      });
  }

  public signMessage(
    message: string,
  ): ResultAsync<
    UtilityMessageSignature,
    BlockchainUnavailableError | VectorError
  > {
    return this.browserNodeProvider.getBrowserNode().andThen((browserNode) => {
      return browserNode.signUtilityMessage(message);
    });
  }

  /**
   * Mint the test token to the provided address
   * @param amount the amount of the test token to mint
   * @param to the (Ethereum) address to mint the test token to
   */
  public mintTestToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const resp = this.blockchainUtils.mintToken(amount, to);

    return resp
      .andThen((mintTx) => {
        return ResultAsync.fromPromise(mintTx.wait(), (e) => {
          return new BlockchainUnavailableError(
            "Error while waiting to mint token",
            e,
          );
        });
      })
      .map(() => {
        return;
      });
  }

  protected _getAssetBalance(
    i: number,
    channelState: IFullChannelState,
  ): ResultAsync<AssetBalance, BlockchainUnavailableError> {
    const assetAddress = EthereumContractAddress(channelState.assetIds[i]);

    return this._getAssetInfo(assetAddress).map((assetInfo) => {
      const amount = BigNumberString(channelState.balances[i].amount[1]);

      // Return the asset balance
      const assetBalance = new AssetBalance(
        EthereumContractAddress(channelState.channelAddress),
        assetAddress,
        assetInfo.name,
        assetInfo.symbol,
        assetInfo.decimals,
        amount,
        BigNumberString("0"), // @todo figure out how to grab the locked amount
        amount,
      );

      return assetBalance;
    });
  }

  protected _getAssetInfo(
    assetAddress: EthereumContractAddress,
  ): ResultAsync<AssetInfo, BlockchainUnavailableError> {
    let name: string;
    let symbol: string;
    let tokenContract: Contract;

    // First, check if we have already cached the info about this asset.
    const cachedAssetInfo = this.assetInfo.get(assetAddress);

    if (cachedAssetInfo == null) {
      // No cached info, we'll have to get it
      return this.blockchainProvider
        .getProvider()
        .andThen((provider) => {
          tokenContract = new Contract(assetAddress, this.erc20Abi, provider);

          return ResultAsync.fromPromise<
            string | null,
            BlockchainUnavailableError
          >(tokenContract.name(), (err) => {
            return err as BlockchainUnavailableError;
          });
        })
        .orElse((err) => {
          this.logUtils.error(`tokenContract.name() failed: ${err.message}`);
          return okAsync<string, BlockchainUnavailableError>("");
        })
        .andThen((myName) => {
          if (myName == null || myName == "") {
            name = `Unknown Token (${assetAddress})`;
          } else {
            name = myName;
          }

          return ResultAsync.fromPromise<
            string | null,
            BlockchainUnavailableError
          >(tokenContract.symbol(), (err) => {
            return err as BlockchainUnavailableError;
          });
        })
        .orElse((err) => {
          this.logUtils.error(`tokenContract.symbol() failed: ${err.message}`);
          return okAsync<string, BlockchainUnavailableError>("");
        })
        .andThen((mySymbol) => {
          if (mySymbol == null || mySymbol == "") {
            symbol = "Unk";
          } else {
            symbol = mySymbol;
          }

          return ResultAsync.fromPromise<
            number | null,
            BlockchainUnavailableError
          >(tokenContract.decimals(), (err) => {
            return err as BlockchainUnavailableError;
          });
        })
        .orElse((err) => {
          this.logUtils.error(
            `tokenContract.decimals() failed: ${err.message}`,
          );
          return okAsync<number, BlockchainUnavailableError>(0);
        })
        .map((myDecimals) => {
          const decimals = myDecimals ?? 0;
          const assetInfo = new AssetInfo(assetAddress, name, symbol, decimals);

          // Store the cached info
          this.assetInfo.set(assetAddress, assetInfo);

          return assetInfo;
        });
    }

    // We have cached info
    return okAsync(cachedAssetInfo);
  }
}
