import { ERC20Abi } from "@connext/vector-types";
import {
  AssetBalance,
  Balances,
  EthereumAddress,
  PublicIdentifier,
  IFullChannelState,
  Signature,
  AssetInfo,
  PersistenceError,
  BlockchainUnavailableError,
  RouterChannelUnknownError,
  BalancesUnavailableError,
  LogicalError,
  VectorError,
  BigNumberString,
} from "@hypernetlabs/objects";
import { ResultUtils, ILogUtils } from "@hypernetlabs/utils";
import { ethers, constants, BigNumber, Contract } from "ethers";
import { combine, errAsync, okAsync, ResultAsync } from "neverthrow";

import { IAccountsRepository } from "@interfaces/data";
import {
  IVectorUtils,
  IBlockchainProvider,
  IBrowserNodeProvider,
  IBrowserNode,
  IBlockchainUtils,
} from "@interfaces/utilities";
import { IStorageUtils } from "@interfaces/data/utilities";

/**
 * Contains methods for getting Ethereum accounts, public identifiers,
 * balances for accounts, and depositing & withdrawing assets.
 */
export class AccountsRepository implements IAccountsRepository {
  /**
   * Retrieves an instances of the AccountsRepository.
   */
  protected assetInfo: Map<EthereumAddress, AssetInfo>;
  protected erc20Abi: string[];

  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected vectorUtils: IVectorUtils,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected blockchainUtils: IBlockchainUtils,
    protected storageUtils: IStorageUtils,
    protected logUtils: ILogUtils,
  ) {
    // We will cache the info about each asset type, so we only have to look it up once.
    this.assetInfo = new Map();

    // Add a default entry for Ethereum, it's not an ERC20, it's special and it's also universal.
    this.assetInfo.set(
      EthereumAddress(constants.AddressZero),
      new AssetInfo(
        EthereumAddress(constants.AddressZero),
        "Ethereum",
        "ETH",
        18,
      ),
    );

    this.erc20Abi = Object.assign([], ERC20Abi);
    this.erc20Abi.push("function name() view returns (string)");
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
    EthereumAddress[],
    BlockchainUnavailableError
  > {
    return this.blockchainProvider.getProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.listAccounts(), (e) => {
        return new BlockchainUnavailableError(
          "Unable to get accounts from blockchain provider",
          e,
        );
      }).map((addresses) => {
        return addresses.map((val) => EthereumAddress(val));
      });
    });
  }

  /**
   * Get all balances associated with this instance.
   */
  public getBalances(): ResultAsync<
    Balances,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  > {
    return this.vectorUtils
      .getRouterChannelAddress()
      .andThen((channelAddress) => {
        return this.browserNodeProvider
          .getBrowserNode()
          .andThen((browserNode) => {
            return browserNode.getStateChannel(channelAddress);
          })
          .andThen((channelState) => {
            const assetBalanceResults = new Array<
              ResultAsync<AssetBalance, VectorError>
            >();

            if (channelState == null) {
              return combine(assetBalanceResults);
            }

            for (let i = 0; i < channelState.assetIds.length; i++) {
              const assetBalanceResult = this._getAssetBalance(i, channelState);
              assetBalanceResults.push(assetBalanceResult);
            }

            return combine(assetBalanceResults);
          })
          .map((assetBalances) => {
            return new Balances(assetBalances);
          });
      });
  }

  /**
   * Get balance for a particular asset for this instance
   * @param assetAddress the (Ethereum) address of the token to get the balance of
   */
  public getBalanceByAsset(
    assetAddress: EthereumAddress,
  ): ResultAsync<
    AssetBalance,
    BalancesUnavailableError | VectorError | RouterChannelUnknownError
  > {
    return this.getBalances().andThen((balances) => {
      for (const assetBalance of balances.assets) {
        if (assetBalance.assetAddress === assetAddress) {
          // The user has a balance of the selected asset type, so we have an asset balance
          // to give back.
          return okAsync(assetBalance);
        }
      }

      // The user does not have a balance in the existing asset. The only problem here
      // is that we still would like to return a proper name for the asset.
      return this._getAssetInfo(assetAddress).map((assetInfo) => {
        return new AssetBalance(
          assetAddress,
          assetInfo.name,
          assetInfo.symbol,
          assetInfo.decimals,
          BigNumberString("0"),
          BigNumberString("0"),
          BigNumberString("0"),
        );
      });
    });
  }

  /**
   * Deposit funds into this instance of Hypernet Core
   * @param assetAddress the (Ethereum) token address to deposit
   * @param amount the amount of the token to deposit
   */
  public depositFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
  ): ResultAsync<
    null,
    | RouterChannelUnknownError
    | VectorError
    | LogicalError
    | BlockchainUnavailableError
  > {
    let signer: ethers.providers.JsonRpcSigner;
    let channelAddress: EthereumAddress;
    let browserNode: IBrowserNode;

    return ResultUtils.combine([
      this.blockchainProvider.getSigner(),
      this.vectorUtils.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ])
      .andThen((vals) => {
        [signer, channelAddress, browserNode] = vals;

        if (assetAddress === "0x0000000000000000000000000000000000000000") {
          this.logUtils.log("Transferring ETH.");
          // send eth
          return ResultAsync.fromPromise(
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
          return this.blockchainUtils.erc20Transfer(
            assetAddress,
            channelAddress,
            amount,
          );
        }
      })
      .andThen((tx) => {
        // TODO: Wait on this, break it up, this could take a while
        return ResultAsync.fromPromise(
          tx.wait(),
          (e) => e as BlockchainUnavailableError,
        );
      })
      .andThen(() => {
        if (browserNode == null || channelAddress == null) {
          return errAsync(new LogicalError("Really screwed up!"));
        }
        return browserNode.reconcileDeposit(assetAddress, channelAddress);
      })
      .andThen((depositRes) => {
        // I can not for the life of me figure out why depositRes is coming back
        // as "unknown"
        const depositChannelAddress = depositRes as string;

        // Sanity check, the deposit was for the channel we tried to deposit into.
        if (depositChannelAddress !== channelAddress) {
          return errAsync(
            new LogicalError("Something has gone horribly wrong!"),
          );
        }

        return okAsync(null);
      });
  }

  /**
   * Withdraw funds from this instance of Hypernet Core to a specified (Ethereum) destination
   * @param assetAddress the token address to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the destination (Ethereum) address to withdraw to
   */
  public withdrawFunds(
    assetAddress: EthereumAddress,
    amount: BigNumberString,
    destinationAddress: EthereumAddress,
  ): ResultAsync<
    void,
    RouterChannelUnknownError | VectorError | BlockchainUnavailableError
  > {
    const prerequisites = ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.vectorUtils.getRouterChannelAddress(),
    ]);

    return prerequisites
      .andThen((vals) => {
        const [browserNode, channelAddress] = vals;
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
  ): ResultAsync<Signature, BlockchainUnavailableError | VectorError> {
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
    to: EthereumAddress,
  ): ResultAsync<void, BlockchainUnavailableError> {
    const resp = this.blockchainUtils.mintToken(amount, to);

    return resp
      .andThen((mintTx) => {
        return ResultAsync.fromPromise(mintTx.wait(), (e) => {
          return e as BlockchainUnavailableError;
        });
      })
      .map(() => {
        return;
      });
  }

  public setPreferredPaymentToken(
    tokenAddress: EthereumAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.storageUtils.write(
      "PreferredPaymentTokenAddress",
      tokenAddress,
    );
  }

  public getPreferredPaymentToken(): ResultAsync<
    AssetInfo,
    BlockchainUnavailableError | PersistenceError
  > {
    return this.storageUtils
      .read<string>("PreferredPaymentTokenAddress")
      .andThen((tokenAddress) => {
        if (tokenAddress == null) {
          return errAsync(
            new PersistenceError(
              "Couldn't get PreferredPaymentTokenAddress from storageUtils.read",
            ),
          );
        }
        return this._getAssetInfo(EthereumAddress(tokenAddress));
      });
  }

  protected _getAssetBalance(
    i: number,
    channelState: IFullChannelState,
  ): ResultAsync<AssetBalance, BlockchainUnavailableError> {
    const assetAddress = EthereumAddress(channelState.assetIds[i]);

    return this._getAssetInfo(assetAddress).map((assetInfo) => {
      const amount = BigNumberString(channelState.balances[i].amount[1]);

      // Return the asset balance
      const assetBalance = new AssetBalance(
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
    assetAddress: EthereumAddress,
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
