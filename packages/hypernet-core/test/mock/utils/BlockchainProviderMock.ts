import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import { Eip1193Bridge } from "@ethersproject/experimental";
import {
  PrivateCredentials,
  BlockchainUnavailableError,
  InvalidParametersError,
  EthereumAddress,
} from "@hypernetlabs/objects";
import { routerChannelAddress, commonAmount, mockUtils } from "@mock/mocks";
import { BigNumber, ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { IBlockchainProvider } from "@interfaces/utilities";

interface ISendTransactionVals {
  to: EthereumAddress;
  value: BigNumber;
}

export class BlockchainProviderMock implements IBlockchainProvider {
  public signer = td.object<ethers.providers.JsonRpcSigner>();
  public provider = td.object<ethers.providers.Web3Provider>();
  public governanceProvider = td.object<ethers.providers.Web3Provider>();

  constructor() {
    td.when(this.provider.listAccounts()).thenResolve(
      mockUtils.generateRandomAccounts().map((val) => val.secretKey),
    );

    td.when(
      this.signer.sendTransaction(
        td.matchers.argThat((arg: ISendTransactionVals) => {
          return arg.to == routerChannelAddress && arg.value.eq(commonAmount);
        }),
      ),
    ).thenResolve({
      wait: () => new Promise((resolve) => resolve({} as TransactionReceipt)),
    } as TransactionResponse);
  }

  public initialize(): ResultAsync<void, BlockchainUnavailableError> {
    return okAsync(undefined);
  }

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, never> {
    return okAsync(this.signer);
  }
  public getProvider(): ResultAsync<ethers.providers.Web3Provider, never> {
    return okAsync(this.provider);
  }

  public getGovernanceProvider(): ResultAsync<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    never
  > {
    return okAsync(this.governanceProvider);
  }

  public getEIP1193Provider(): ResultAsync<Eip1193Bridge, never> {
    throw new Error("Method not implemented.");
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
