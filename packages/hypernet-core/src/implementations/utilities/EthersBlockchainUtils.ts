import { IBlockchainProvider, IBlockchainUtils } from "@interfaces/utilities";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
import { Contract, ethers, BigNumber } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BlockchainUnavailableError, InvalidParametersError } from "@hypernetlabs/objects";
import { ResultAsync, errAsync } from "neverthrow";
import { ERC20Abi } from "@connext/vector-types";
import { Signature, EthereumAddress } from "@hypernetlabs/objects";
import { artifacts } from "@connext/vector-contracts";

export class EthersBlockchainUtils implements IBlockchainUtils {
  protected erc20Abi: string[];
  constructor(protected blockchainProvider: IBlockchainProvider) {
    // The ERC20Abi from Vector does not include the name() function, so we will roll our own
    this.erc20Abi = Object.assign([], ERC20Abi);
    this.erc20Abi.push("function name() view returns (string)");
  }

  public verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: Signature,
  ): EthereumAddress {
    return EthereumAddress(ethers.utils.verifyTypedData(domain, types, value, signature));
  }

  public erc20Transfer(
    assetAddress: EthereumAddress,
    channelAddress: string,
    amount: BigNumber,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError> {
    if (!assetAddress || !channelAddress || !amount) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return this.blockchainProvider.getSigner().andThen((signer) => {
      const tokenContract = new Contract(assetAddress, this.erc20Abi, signer);
      return ResultAsync.fromPromise(tokenContract.transfer(channelAddress, amount), (err) => {
        return err as BlockchainUnavailableError;
      });
    });
  }

  public mintToken(
    amount: BigNumber,
    to: EthereumAddress,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError | InvalidParametersError> {
    if (!amount || !to) {
      return errAsync(new InvalidParametersError("Incorrectly provided arguments"));
    }

    return this.blockchainProvider.getSigner().andThen((signer) => {
      const testTokenContract = new Contract(
        "0x9FBDa871d559710256a2502A2517b794B482Db40",
        artifacts.TestToken.abi,
        signer,
      );

      return ResultAsync.fromPromise(testTokenContract.mint(to, amount) as Promise<TransactionResponse>, (e) => {
        return e as BlockchainUnavailableError;
      });
    });
  }
}
