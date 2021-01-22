import { ERC20Abi } from "@connext/vector-types";
import { IAccountsRepository } from "@interfaces/data";
import { AssetBalance, Balances, BigNumber, EthereumAddress, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import {
  IVectorUtils,
  IBlockchainProvider,
  IBrowserNodeProvider,
  ILogUtils,
  IBrowserNode,
} from "@interfaces/utilities";
import { Contract } from "ethers";
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
import { ethers } from "ethers";

/**
 * Contains methods for getting Ethereum accounts, public identifiers,
 * balances for accounts, and depositing & withdrawing assets.
 */
export class AccountsRepository implements IAccountsRepository {
  /**
   * Retrieves an instances of the AccountsRepository.
   */
  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected vectorUtils: IVectorUtils,
    protected browserNodeProvider: IBrowserNodeProvider,
    protected logUtils: ILogUtils,
  ) {}

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
  public getBalances(): ResultAsync<Balances, BalancesUnavailableError> {
    return this.vectorUtils.getRouterChannelAddress().andThen((channelAddress: string) => {
      return this.browserNodeProvider
        .getBrowserNode()
        .andThen((browserNode) => {
          return browserNode.getStateChannel(channelAddress);
        })
        .andThen((channelState) => {
          if (channelState == null) {
            return okAsync(new Balances([]));
          }

          const assetBalances = new Array<AssetBalance>();

          for (let i = 0; i < channelState.assetIds.length; i++) {
            assetBalances.push(
              new AssetBalance(
                channelState.assetIds[i],
                BigNumber.from(channelState.balances[i].amount[1]),
                BigNumber.from(0), // @todo figure out how to grab the locked amount
                BigNumber.from(channelState.balances[i].amount[1]),
              ),
            );
          }
          return okAsync(new Balances(assetBalances));
        });
    });
  }

  /**
   * Get balance for a particular asset for this instance
   * @param assetAddress the (Ethereum) address of the token to get the balance of
   */
  public getBalanceByAsset(assetAddress: EthereumAddress): ResultAsync<AssetBalance, BalancesUnavailableError> {
    return this.getBalances().map((balances) => {
      for (const assetBalance of balances.assets) {
        if (assetBalance.assetAddresss === assetAddress) {
          return assetBalance;
        }
      }
      return new AssetBalance(assetAddress, BigNumber.from(0), BigNumber.from(0), BigNumber.from(0));
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
    const prerequisites = (combine([
      this.blockchainProvider.getSigner() as ResultAsync<any, any>,
      this.vectorUtils.getRouterChannelAddress(),
      this.browserNodeProvider.getBrowserNode(),
    ]) as unknown) as ResultAsync<
      [ethers.providers.JsonRpcSigner, string, IBrowserNode],
      RouterChannelUnknownError | CoreUninitializedError | VectorError | Error | BlockchainUnavailableError
    >;

    let channelAddress: string;
    let browserNode: IBrowserNode;

    return prerequisites
      .andThen((vals) => {
        let signer: ethers.providers.JsonRpcSigner;
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
          const tokenContract = new Contract(assetAddress, ERC20Abi, signer);
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
    const prerequisites = (combine([
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
}
