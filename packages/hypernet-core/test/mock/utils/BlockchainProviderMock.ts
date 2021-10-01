import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import {
  PrivateCredentials,
  BlockchainUnavailableError,
  InvalidParametersError,
  EthereumAddress,
  GovernanceSignerUnavailableError,
} from "@hypernetlabs/objects";
import { routerChannelAddress, commonAmount, mockUtils } from "@mock/mocks";
import { BigNumber, ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { IBlockchainProvider } from "@interfaces/utilities";
import { CeramicEIP1193Bridge } from "@implementations/utilities";

interface ISendTransactionVals {
  to: EthereumAddress;
  value: BigNumber;
}

export class BlockchainProviderMock implements IBlockchainProvider {
  public signer = td.object<ethers.providers.JsonRpcSigner>();
  public provider = td.object<ethers.providers.JsonRpcProvider>();
  public governanceProvider = td.object<ethers.providers.Provider>();
  public governanceSigner = td.object<ethers.providers.JsonRpcSigner>();

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
  public getProvider(): ResultAsync<ethers.providers.JsonRpcProvider, never> {
    return okAsync(this.provider);
  }

  public getGovernanceProvider(): ResultAsync<
    ethers.providers.Provider,
    never
  > {
    return okAsync(this.governanceProvider);
  }

  public getGovernanceSigner(): ResultAsync<
    ethers.providers.JsonRpcSigner,
    GovernanceSignerUnavailableError
  > {
    return okAsync(this.governanceSigner);
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

  public getCeramicEIP1193Provider(): ResultAsync<CeramicEIP1193Bridge, never> {
    return okAsync(new CeramicEIP1193Bridge(this.signer, this.provider));
  }
}
