import {
  TransactionResponse,
  TransactionReceipt,
} from "@ethersproject/abstract-provider";
import {
  PrivateCredentials,
  BlockchainUnavailableError,
  InvalidParametersError,
  GovernanceSignerUnavailableError,
  EthereumContractAddress,
  ProviderId,
  ChainId,
} from "@hypernetlabs/objects";
import { routerChannelAddress, commonAmount, mockUtils } from "@mock/mocks";
import { BigNumber, ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import td from "testdouble";

import { CeramicEIP1193Bridge } from "@implementations/utilities";
import { IBlockchainProvider } from "@interfaces/utilities";

interface ISendTransactionVals {
  to: EthereumContractAddress;
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

  public isMetamaskVal = true;
  public isMetamask(): boolean {
    return this.isMetamaskVal;
  }

  public supplyProviderId(
    providerId: ProviderId,
  ): ResultAsync<void, InvalidParametersError> {
    return okAsync(undefined);
  }

  public setGovernanceSigner(
    chainId: ChainId,
  ): ResultAsync<
    void,
    | BlockchainUnavailableError
    | InvalidParametersError
    | GovernanceSignerUnavailableError
  > {
    return okAsync(undefined);
  }

  public getMainProviderChainId(): ResultAsync<
    ChainId,
    BlockchainUnavailableError
  > {
    return okAsync(ChainId(1));
  }
}
