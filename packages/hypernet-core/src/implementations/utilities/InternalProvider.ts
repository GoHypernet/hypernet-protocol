import { ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import { EthereumAddress, IPrivateCredentials } from "@hypernetlabs/objects";
import { IInternalProvider } from "@interfaces/utilities";

export class InternalProvider extends ethers.providers.JsonRpcProvider implements IInternalProvider {
  private _provider: ethers.providers.JsonRpcProvider;
  private _wallet: ethers.Wallet;

  constructor(protected privateCredentials: IPrivateCredentials) {
    super();
    this._provider = new ethers.providers.JsonRpcProvider(
      this.privateCredentials.networkUrl || "http://localhost:8545",
    );
    this._wallet = ethers.Wallet.fromMnemonic(
      this.privateCredentials.mnemonic || "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
    );
    this._wallet.connect(this._provider);
  }

  public get provider(): ResultAsync<ethers.providers.JsonRpcProvider, never> {
    return okAsync(this._provider);
  }

  public get address(): EthereumAddress {
    return this._wallet.address;
  }
}
