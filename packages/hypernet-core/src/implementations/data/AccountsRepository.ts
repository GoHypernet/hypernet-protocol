import { ERC20Abi } from "@connext/vector-types";
import { IAccountsRepository } from "@interfaces/data";
import { AssetBalance, Balances, BigNumber, EthereumAddress, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import {
  IVectorUtils,
  IBlockchainProvider,
  IBrowserNodeProvider,
  ILogUtils,
  IBrowserNode,
  IFullChannelState,
} from "@interfaces/utilities";
import { Contract, ethers, constants } from "ethers";
import { artifacts } from "@connext/vector-contracts";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import {
  BalancesUnavailableError,
  BlockchainUnavailableError,
  CoreUninitializedError,
  RouterChannelUnknownError,
  VectorError,
} from "@interfaces/objects/errors";
import { combine, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "@implementations/utilities";

class AssetInfo {
  constructor(public assetId: EthereumAddress, public name: string, public symbol: string, public decimals: number) {}
}

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
    protected logUtils: ILogUtils,
  ) {
    // The ERC20Abi from Vector does not include the name() function, so we will roll our own
    this.erc20Abi = Object.assign([], ERC20Abi);
    this.erc20Abi.push("function name() view returns (string)");

    // We will cache the info about each asset type, so we only have to look it up once.
    this.assetInfo = new Map();

    // Add a default entry for Ethereum, it's not an ERC20, it's special and it's also universal.
    this.assetInfo.set(constants.AddressZero, new AssetInfo(constants.AddressZero, "Ethereum", "ETH", 18));
  }

  /**
   * Get the current public identifier for this instance.
   */
  public getPublicIdentifier(): ResultAsync<PublicIdentifier, VectorError | Error> {
    return this.browserNodeProvider.getBrowserNode().map((browserNode) => {
      return browserNode.publicIdentifier;
    });
  }

  /**
   * Get the Ethereum accounts associated with this instance.
   */
  public getAccounts(): ResultAsync<string[], BlockchainUnavailableError> {
    return this.blockchainProvider.getProvider().andThen((provider) => {
      return ResultAsync.fromPromise(provider.listAccounts(), (e) => {
        return e as BlockchainUnavailableError;
      });
    });
  }

  /**
   * Get all balances associated with this instance.
   */
  public getBalances(): ResultAsync<Balances, BalancesUnavailableError | VectorError> {
    return this.vectorUtils.getRouterChannelAddress().andThen((channelAddress: string) => {
      return this.browserNodeProvider
        .getBrowserNode()
        .andThen((browserNode) => {
          return browserNode.getStateChannel(channelAddress);
        })
        .andThen((channelState) => {
          const assetBalanceResults = new Array<ResultAsync<AssetBalance, VectorError>>();

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
  public getBalanceByAsset(assetAddress: EthereumAddress): ResultAsync<AssetBalance, BalancesUnavailableError> {
    return this.getBalances().andThen((balances) => {
      for (const assetBalance of balances.assets) {
        if (assetBalance.assetAddresss === assetAddress) {
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
          BigNumber.from(0),
          BigNumber.from(0),
          BigNumber.from(0),
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
    amount: BigNumber,
  ): ResultAsync<
    null,
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error | BlockchainUnavailableError
  > {
    const prerequisites = (ResultUtils.combine([
      this.blockchainProvider.getSigner(),
      this.vectorUtils.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [ethers.providers.JsonRpcSigner, string, IBrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | VectorError | Error | BlockchainUnavailableError
    >;

    let signer: ethers.providers.JsonRpcSigner;
    let channelAddress: string;
    let browserNode: IBrowserNode;

    return prerequisites
      .andThen((vals) => {
        [signer, channelAddress, browserNode] = vals;

        let tx: ResultAsync<TransactionResponse, BlockchainUnavailableError>;

        if (assetAddress === "0x0000000000000000000000000000000000000000") {
          this.logUtils.log("Transferring ETH.");
          // send eth
          tx = ResultAsync.fromPromise(signer.sendTransaction({ to: channelAddress, value: amount }), (err) => {
            return err as BlockchainUnavailableError;
          });
        } else {
          this.logUtils.log("Transferring an ERC20 asset.");
          // send an actual erc20 token
          const tokenContract = new Contract(assetAddress, this.erc20Abi, signer);
          tx = ResultAsync.fromPromise(tokenContract.transfer(channelAddress, amount), (err) => {
            return err as BlockchainUnavailableError;
          });
        }

        return tx;
      })
      .andThen((tx) => {
        // TODO: Wait on this, break it up, this could take a while
        return ResultAsync.fromPromise(tx.wait());
      })
      .andThen((receipt) => {
        if (browserNode == null || channelAddress == null) {
          return errAsync(new Error("Really screwed up!"));
        }

        return browserNode.reconcileDeposit(assetAddress, channelAddress);
      })
      .andThen((depositRes) => {
        // I can not for the life of me figure out why depositRes is coming back
        // as "unknown"
        const channelAddress = depositRes as string;

        // Sanity check, the deposit was for the channel we tried to deposit into.
        if (channelAddress !== channelAddress) {
          return errAsync(new Error("Something has gone horribly wrong!"));
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
    assetAddress: string,
    amount: BigNumber,
    destinationAddress: string,
  ): ResultAsync<void, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const prerequisites = (ResultUtils.combine([
      this.browserNodeProvider.getBrowserNode(),
      this.vectorUtils.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [IBrowserNode, string],
      RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
    >;

    return prerequisites
      .andThen((vals) => {
        const [browserNode, channelAddress] = vals;
        return browserNode.withdraw(channelAddress, amount.toString(), assetAddress, destinationAddress, "0");
      })
      .map(() => {
        return;
      });
  }

  /**
   * Mint the test token to the provided address
   * @param amount the amount of the test token to mint
   * @param to the (Ethereum) address to mint the test token to
   */
  public mintTestToken(amount: BigNumber, to: EthereumAddress): ResultAsync<void, BlockchainUnavailableError> {
    return this.blockchainProvider
      .getSigner()
      .andThen((signer) => {
        const testTokenContract = new Contract(
          "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0",
          artifacts.TestToken.abi,
          signer,
        );

        return ResultAsync.fromPromise(testTokenContract.mint(to, amount) as Promise<TransactionResponse>, (e) => {
          return e as BlockchainUnavailableError;
        });
      })
      .andThen((mintTx) => {
        return ResultAsync.fromPromise(mintTx.wait(), (e) => {
          return e as BlockchainUnavailableError;
        });
      })
      .map(() => {
        return;
      });
  }

  protected _getAssetBalance(i: number, channelState: IFullChannelState): ResultAsync<AssetBalance, VectorError> {
    const assetAddress = channelState.assetIds[i];

    return this._getAssetInfo(assetAddress).map((assetInfo) => {
      // Return the asset balance
      const assetBalance = new AssetBalance(
        assetAddress,
        assetInfo.name,
        assetInfo.symbol,
        assetInfo.decimals,
        BigNumber.from(channelState.balances[i].amount[1]),
        BigNumber.from(0), // @todo figure out how to grab the locked amount
        BigNumber.from(channelState.balances[i].amount[1]),
      );

      return assetBalance;
    });
  }

  // TODO: fix it, tokenContract.name() not working
  protected _getAssetInfo(assetAddress: EthereumAddress): ResultAsync<AssetInfo, BlockchainUnavailableError> {
    /* let name: string;
    let symbol: string;
    let tokenContract: Contract;

    // First, check if we have already cached the info about this asset.
    const cachedAssetInfo = this.assetInfo.get(assetAddress);

    if (cachedAssetInfo == null) {
      // No cached info, we'll have to get it
      return this.blockchainProvider
        .getSigner()
        .andThen((signer) => {
          tokenContract = new Contract(assetAddress, this.erc20Abi, signer);

          return ResultAsync.fromPromise<string | null, BlockchainUnavailableError>(tokenContract.name(), (err) => {
            return err as BlockchainUnavailableError;
          });
        })
        .andThen((myName) => {
          if (myName == null || myName == "") {
            name = `Unknown Token (${assetAddress})`;
          } else {
            name = myName;
          }

          return ResultAsync.fromPromise<string | null, BlockchainUnavailableError>(tokenContract.symbol(), (err) => {
            return err as BlockchainUnavailableError;
          });
        })
        .andThen((mySymbol) => {
          if (mySymbol == null || mySymbol == "") {
            symbol = "Unk";
          } else {
            symbol = mySymbol;
          }

          return ResultAsync.fromPromise<number | null, BlockchainUnavailableError>(tokenContract.decimals(), (err) => {
            return err as BlockchainUnavailableError;
          });
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
    return okAsync(cachedAssetInfo);*/

    return okAsync(new AssetInfo(assetAddress, "", "", 0));
  }
}
