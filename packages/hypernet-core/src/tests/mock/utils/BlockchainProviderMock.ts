import { ResultAsync } from "@interfaces/objects";
import { BlockchainUnavailableError } from "@interfaces/objects/errors";
import { IBlockchainProvider } from "@interfaces/utilities";
import { ethers } from "ethers";
import { okAsync } from "neverthrow";
import td from 'testdouble'

export class BlockchainProviderMock implements IBlockchainProvider {
  public signer =  td.object<ethers.providers.JsonRpcSigner>();
  public provider = td.object<ethers.providers.Web3Provider>();

  public getSigner(): ResultAsync<ethers.providers.JsonRpcSigner, BlockchainUnavailableError> {
    return okAsync(this.signer);
  }
  public getProvider(): ResultAsync<ethers.providers.Web3Provider, BlockchainUnavailableError> {
    return okAsync(this.provider);
  }
}

export function createBlockchainProviderMock() {
  const blockchainProviderMock = td.object<IBlockchainProvider>();
  const signerMock =  td.object<ethers.providers.JsonRpcSigner>();
  const providerMock = td.object<ethers.providers.Web3Provider>();

  td.when(blockchainProviderMock.getProvider()).thenReturn(okAsync(providerMock));
  td.when(blockchainProviderMock.getSigner()).thenReturn(okAsync(signerMock));
}
