import { ERC20Abi, FullChannelState } from "@connext/vector-types";
import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { AssetBalance, Balances, BigNumber, EthereumAddress, PublicIdentifier } from "@interfaces/objects";
import { IVectorUtils, IBlockchainProvider, IBrowserNodeProvider } from "@interfaces/utilities";
import { Contract } from "ethers";
import { artifacts } from "@connext/vector-contracts";

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
  ) {}

  /**
   * Get the current public identifier for this instance.
   */
  public async getPublicIdentifier(): Promise<PublicIdentifier> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();

    return browserNode.publicIdentifier;
  }

  /**
   * Get the Ethereum accounts associated with this instance.
   */
  public async getAccounts(): Promise<string[]> {
    const provider = await this.blockchainProvider.getProvider();

    return await provider.listAccounts();
  }

  /**
   * Get all balances associated with this instance.
   */
  public async getBalances(): Promise<Balances> {
    const browserNode = await this.browserNodeProvider.getBrowserNode();
    const channelAddress = await this.vectorUtils.getRouterChannelAddress();
    const channelStateRes = await browserNode.getStateChannel({ channelAddress });

    if (channelStateRes.isError) {
      throw new Error("Cannot get the state channel status!");
    }

    const channelState = channelStateRes.getValue() as FullChannelState;

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
    return new Balances(assetBalances);
  }

  /**
   * Get balance for a particular asset for this instance
   * @param assetAddress the (Ethereum) address of the token to get the balance of
   */
  public async getBalanceByAsset(assetAddress: EthereumAddress): Promise<AssetBalance> {
    const balances = await this.getBalances();

    for (const assetBalance of balances.assets) {
      if (assetBalance.assetAddresss === assetAddress) {
        return assetBalance;
      }
    }
    return new AssetBalance(assetAddress, BigNumber.from(0), BigNumber.from(0), BigNumber.from(0));
  }

  /**
   * Deposit funds into this instance of Hypernet Core
   * @param assetAddress the (Ethereum) token address to deposit
   * @param amount the amount of the token to deposit
   */
  public async depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void> {
    const signer = await this.blockchainProvider.getSigner();
    const channelAddress = await this.vectorUtils.getRouterChannelAddress();
    const browserNode = await this.browserNodeProvider.getBrowserNode();

    let tx;

    if (assetAddress == "0x0000000000000000000000000000000000000000") {
      console.log("Transferring ETH.");
      // send eth
      tx = await signer.sendTransaction({ to: channelAddress, value: amount });
    } else {
      console.log("Transferring an ERC20 asset.");
      // send an actual erc20 token
      let tokenContract = new Contract(assetAddress, ERC20Abi, signer);
      tx = await tokenContract.transfer(channelAddress, amount);
    }

    // TODO: Wait on this, break it up, this could take a while
    await tx.wait();

    const depositRes = await browserNode.reconcileDeposit({
      assetId: assetAddress,
      channelAddress,
      // publicIdentifier: browserNode.publicIdentifier
    });

    if (depositRes.isError) {
      console.log(depositRes.getError());
      throw new Error("Deposit can not be reconciled");
    }

    const deposit = depositRes.getValue();

    if (deposit.channelAddress !== channelAddress) {
      throw new Error("Something has gone horribly wrong!");
    }
  }

  /**
   * Withdraw funds from this instance of Hypernet Core to a specified (Ethereum) destination
   * @param assetAddress the token address to withdraw
   * @param amount the amount of the token to withdraw
   * @param destinationAddress the destination (Ethereum) address to withdraw to
   */
  public async withdrawFunds(assetAddress: string, amount: BigNumber, destinationAddress: string): Promise<void> {
    const channelAddress = await this.vectorUtils.getRouterChannelAddress();
    const browserNode = await this.browserNodeProvider.getBrowserNode();

    await browserNode.withdraw({
      channelAddress,
      amount: amount.toString(),
      assetId: assetAddress,
      recipient: destinationAddress,
      fee: "0",
    });
  }

  /**
   * Mint the test token to the provided address
   * @param amount the amount of the test token to mint
   * @param to the (Ethereum) address to mint the test token to
   */
  public async mintTestToken(amount: BigNumber, to: EthereumAddress): Promise<void> {
    const [provider, signer] = await Promise.all([
      this.blockchainProvider.getProvider(),
      await this.blockchainProvider.getSigner(),
    ]);

    const testTokenContract = new Contract(
      "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0",
      artifacts["TestToken"].abi,
      signer,
    );
    let mintTx = await testTokenContract.mint(to, amount);
    await mintTx.wait();
  }
}
