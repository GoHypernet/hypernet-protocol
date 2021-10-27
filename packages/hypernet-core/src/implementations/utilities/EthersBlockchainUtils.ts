import { artifacts } from "@connext/vector-contracts";
import { ERC20Abi } from "@connext/vector-types";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  TransferAbis,
  BigNumberString,
  BlockchainUnavailableError,
  Signature,
  HexString,
  ChainId,
  EthereumAccountAddress,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { Contract, ethers } from "ethers";
import { errAsync, ResultAsync } from "neverthrow";

import {
  IBlockchainProvider,
  IBlockchainUtils,
  IConfigProvider,
} from "@interfaces/utilities";

export class EthersBlockchainUtils implements IBlockchainUtils {
  protected erc20Abi: string[];
  constructor(
    protected blockchainProvider: IBlockchainProvider,
    protected configProvider: IConfigProvider,
  ) {
    // The ERC20Abi from Vector does not include the name() function, so we will roll our own
    this.erc20Abi = Object.assign([], ERC20Abi);
    this.erc20Abi.push("function name() view returns (string)");
  }

  public verifyTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, unknown>,
    signature: Signature,
  ): EthereumAccountAddress {
    return EthereumAccountAddress(
      ethers.utils.verifyTypedData(domain, types, value, signature),
    );
  }

  public erc20Transfer(
    assetAddress: EthereumContractAddress,
    channelAddress: string,
    amount: BigNumberString,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError> {
    return this.blockchainProvider.getSigner().andThen((signer) => {
      const tokenContract = new Contract(assetAddress, this.erc20Abi, signer);
      return ResultAsync.fromPromise(
        tokenContract.transfer(channelAddress, amount),
        (err) => {
          return new BlockchainUnavailableError(
            "Unable to complete an ERC20 token transfer",
            err,
          );
        },
      );
    });
  }

  public mintToken(
    amount: BigNumberString,
    to: EthereumAccountAddress,
  ): ResultAsync<TransactionResponse, BlockchainUnavailableError> {
    return this.blockchainProvider.getSigner().andThen((signer) => {
      const testTokenContract = new Contract(
        "0x9FBDa871d559710256a2502A2517b794B482Db40", // Test Token address
        artifacts.TestToken.abi,
        signer,
      );

      return ResultAsync.fromPromise(
        testTokenContract.mint(to, amount) as Promise<TransactionResponse>,
        (e) => {
          return new BlockchainUnavailableError("Unable to mint test token", e);
        },
      );
    });
  }

  public getMessageTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.blockchainProvider.getProvider(),
      this.configProvider.getConfig(),
    ]).andThen((vals) => {
      const [provider, config] = vals;

      const messageTransferAddress =
        config.chainAddresses[chainId]?.messageTransferAddress;
      if (messageTransferAddress == null) {
        return errAsync<[string, HexString], BlockchainUnavailableError>(
          new BlockchainUnavailableError(
            `Unable to getGatewayRegistrationInfo for chain ${chainId}. No configuration info for that chain is available`,
          ),
        );
      }

      const messageTransferContract = new Contract(
        messageTransferAddress,
        TransferAbis.MessageTransfer.abi,
        provider,
      );

      return ResultUtils.combine([
        ResultAsync.fromPromise(
          messageTransferContract.ResolverEncoding() as Promise<HexString>,
          (e) => {
            return new BlockchainUnavailableError(
              "Unable to retrieve the ResolverEncoding from the message transfer contract",
              e,
            );
          },
        ),

        ResultAsync.fromPromise(
          messageTransferContract.EncodedCancel() as Promise<HexString>,
          (e) => {
            return e as BlockchainUnavailableError;
          },
        ),
      ]);
    });
  }

  public getInsuranceTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.blockchainProvider.getProvider(),
      this.configProvider.getConfig(),
    ]).andThen((vals) => {
      const [provider, config] = vals;

      const insuranceTransferAddress =
        config.chainAddresses[chainId]?.insuranceTransferAddress;
      if (insuranceTransferAddress == null) {
        return errAsync<[string, HexString], BlockchainUnavailableError>(
          new BlockchainUnavailableError(
            `Unable to getInsuranceTransferEncodedCancelData for chain ${chainId}. No configuration info for that chain is available`,
          ),
        );
      }

      const insuranceTransferContract = new Contract(
        insuranceTransferAddress,
        TransferAbis.Insurance.abi,
        provider,
      );

      return ResultUtils.combine([
        ResultAsync.fromPromise(
          insuranceTransferContract.ResolverEncoding() as Promise<HexString>,
          (e) => {
            return e as BlockchainUnavailableError;
          },
        ),

        ResultAsync.fromPromise(
          insuranceTransferContract.EncodedCancel() as Promise<HexString>,
          (e) => {
            return e as BlockchainUnavailableError;
          },
        ),
      ]);
    });
  }

  public getParameterizedTransferEncodedCancelData(
    chainId: ChainId,
  ): ResultAsync<[string, HexString], BlockchainUnavailableError> {
    return ResultUtils.combine([
      this.blockchainProvider.getProvider(),
      this.configProvider.getConfig(),
    ]).andThen((vals) => {
      const [provider, config] = vals;

      const parameterizedTransferAddress =
        config.chainAddresses[chainId]?.parameterizedTransferAddress;
      if (parameterizedTransferAddress == null) {
        return errAsync<[string, HexString], BlockchainUnavailableError>(
          new BlockchainUnavailableError(
            `Unable to getParameterizedTransferEncodedCancelData for chain ${chainId}. No configuration info for that chain is available`,
          ),
        );
      }

      const parameterizedTransferContract = new Contract(
        parameterizedTransferAddress,
        TransferAbis.Parameterized.abi,
        provider,
      );

      return ResultUtils.combine([
        ResultAsync.fromPromise(
          parameterizedTransferContract.ResolverEncoding() as Promise<HexString>,
          (e) => {
            return e as BlockchainUnavailableError;
          },
        ),

        ResultAsync.fromPromise(
          parameterizedTransferContract.EncodedCancel() as Promise<HexString>,
          (e) => {
            return e as BlockchainUnavailableError;
          },
        ),
      ]);
    });
  }

  public getERC721Entry<T>(
    contractAddress: EthereumContractAddress,
    key: string,
  ): ResultAsync<T, BlockchainUnavailableError> {
    return this.blockchainProvider
      .getGovernanceProvider()
      .andThen((provider) => {
        const erc721Contract = new Contract(
          contractAddress,
          TransferAbis.ERC721.abi,
          provider,
        );

        return ResultAsync.fromPromise(
          erc721Contract.registryMap(key) as Promise<number>,
          (e) => {
            return new BlockchainUnavailableError(
              `Cannot get index of token with key ${key} for contract at ${contractAddress}`,
              e,
            );
          },
        ).andThen((registryIndex) => {
          return ResultAsync.fromPromise(
            erc721Contract.tokenURI(registryIndex) as Promise<string>,
            (e) => {
              return new BlockchainUnavailableError(
                `Cannot retrieve token at index ${registryIndex} with key ${key} for contract at ${contractAddress}`,
                e,
              );
            },
          );
        });
      })
      .map((registryString) => {
        return JSON.parse(registryString) as T;
      });
  }
}
