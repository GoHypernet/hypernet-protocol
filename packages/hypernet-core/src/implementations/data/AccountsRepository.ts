import { IAccountsRepository } from "@interfaces/data/IAccountsRepository";
import { BigNumber, EthereumAddress } from "@interfaces/objects";
import { IVectorUtils, IBlockchainProvider, IBrowserNodeProvider } from "@interfaces/utilities";

export class AccountsRepository implements IAccountsRepository {
  constructor(protected blockchainProvider: IBlockchainProvider,
    protected vectorUtils: IVectorUtils,
    protected browserNodeProvider: IBrowserNodeProvider) {}

  public async getAccounts(): Promise<string[]> {
    const provider = await this.blockchainProvider.getProvider();

    return await provider.listAccounts();
  }

  public async depositFunds(assetAddress: EthereumAddress, amount: BigNumber): Promise<void> {
    const signer = await this.blockchainProvider.getSigner();
    const channelAddress = await this.vectorUtils.getRouterChannelAddress();
    const browserNode = await this.browserNodeProvider.getBrowserNode();

    const tx = await signer.sendTransaction({ to: channelAddress, value: amount });

    // TODO: Wait on this, break it up, this could take a while
    await tx.wait();

    const depositRes = await browserNode.reconcileDeposit({
      assetId: assetAddress,
      channelAddress: channelAddress,
      //publicIdentifier: browserNode.publicIdentifier
    });

    if (depositRes.isError) {
      console.log(depositRes.getError());
      throw new Error("Deposit can not be reconciled");
    }
    const deposit = depositRes.getValue();

    if (deposit.channelAddress != channelAddress) {
      throw new Error("Something has gone horribly wrong!");
    }
  }
}
