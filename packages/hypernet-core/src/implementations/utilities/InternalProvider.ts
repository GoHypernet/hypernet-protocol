import {
  ChainId,
  ChainInformation,
  EthereumAccountAddress,
  PrivateCredentials,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

import { IInternalProvider } from "@interfaces/utilities";

export class InternalProvider implements IInternalProvider {
  protected providerInitializedPromiseResolve: () => void;
  protected providerPromise: Promise<void>;
  private _provider: ethers.providers.JsonRpcProvider | null = null;
  private _wallet: ethers.Wallet | null = null;

  constructor(
    protected chainInfo: ChainInformation,
    protected privateCredentials: PrivateCredentials,
  ) {
    this.providerInitializedPromiseResolve = () => null;
    this.providerPromise = new Promise((resolve) => {
      this.providerInitializedPromiseResolve = resolve;
    });

    this._provider = new ethers.providers.JsonRpcProvider(
      chainInfo.providerUrls[0],
    );
    if (this.privateCredentials.mnemonic) {
      this._wallet = ethers.Wallet.fromMnemonic(
        this.privateCredentials.mnemonic,
      );
    } else {
      this._wallet = new ethers.Wallet(
        this.privateCredentials.privateKey as string,
        this._provider,
      );
    }

    this._wallet.connect(this._provider);
    this.providerInitializedPromiseResolve();
  }

  public getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never> {
    return ResultAsync.fromSafePromise<void, never>(
      this.providerPromise,
    ).andThen(() => {
      return okAsync(this._provider as ethers.providers.JsonRpcProvider);
    });
  }

  public getAddress(): ResultAsync<EthereumAccountAddress, never> {
    return ResultAsync.fromSafePromise<void, never>(
      this.providerPromise,
    ).andThen(() => {
      return okAsync(EthereumAccountAddress(this._wallet?.address as string));
    });
  }
}
