import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import {
  PrivateCredentials,
  BlockchainUnavailableError,
  InvalidParametersError,
} from "@hypernetlabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { IBlockchainProvider } from "@interfaces/utilities";
import { routerChannelAddress, commonAmount, mockUtils } from "@mock/mocks";

export class BlockchainProviderMock implements IBlockchainProvider {
  public signer = td.object<ethers.providers.JsonRpcSigner>();
  public provider = td.object<ethers.providers.Web3Provider>();

  constructor() {
    td.when(this.provider.listAccounts()).thenResolve(
      mockUtils.generateRandomAccounts(),
    );

    td.when(
      this.signer.sendTransaction({
        to: routerChannelAddress,
        value: commonAmount,
      }),
    ).thenResolve({
      wait: () => new Promise((resolve) => resolve({} as TransactionReceipt)),
    } as TransactionResponse);
  }

  public getSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    BlockchainUnavailableError
  > {
    return okAsync(this.signer);
  }
  public getProvider(): ResultAsync<
    ethers.providers.Web3Provider,
    BlockchainUnavailableError
  > {
    return okAsync(this.provider);
  }

  public getLatestBlock(): ResultAsync<
    ethers.providers.Block,
    BlockchainUnavailableError
  > {
    return okAsync({} as ethers.providers.Block);
  }

  public supplyPrivateCredentials(
    privateCredentials: PrivateCredentials,
  ): ResultAsync<void, InvalidParametersError> {
    return okAsync(undefined);
  }
}
