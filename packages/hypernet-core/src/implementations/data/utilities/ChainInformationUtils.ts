import { NonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import {
  RegistryEntry,
  NonFungibleRegistryContractError,
  ChainInformation,
  EthereumContractAddress,
  ProviderUrl,
  ChainId,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IChainInformationUtils } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";

@injectable()
export class ChainInformationUtils implements IChainInformationUtils {
  protected chainInfo: ChainInformation[] = [];
  protected governanceChainInfo: ChainInformation = {} as ChainInformation;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, NonFungibleRegistryContractError> {
    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceProvider(),
      this.configProvider.getConfig(),
    ]).andThen(([provider, config]) => {
      const nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          config.chainRegistryAddress,
        );
      return nonFungibleRegistryContract
        .totalSupply()
        .andThen((totalCount) => {
          const registryEntryListResult: ResultAsync<
            RegistryEntry | null,
            NonFungibleRegistryContractError
          >[] = [];
          for (let i = 1; i <= totalCount; i++) {
            const registryEntryResult = nonFungibleRegistryContract
              .tokenByIndex(i)
              .andThen<RegistryEntry | null, NonFungibleRegistryContractError>(
                (tokenId) => {
                  return nonFungibleRegistryContract.getRegistryEntryByTokenId(
                    tokenId,
                  );
                },
              )
              .orElse(() => {
                return okAsync(null);
              });

            registryEntryListResult.push(registryEntryResult);
          }
          return ResultUtils.combine(registryEntryListResult);
        })
        .map((registryEntriesOrNulls) => {
          this.chainInfo = registryEntriesOrNulls
            .filter((val) => {
              return val != null;
            })
            .map((registryEntry) => {
              if (registryEntry == null) {
                throw new Error("Oh no! Bear is driving! How can this be?!");
              }
              if (registryEntry.tokenURI == null) {
                throw new Error(
                  `Invalid entry in Chain Registry. The tokenURI is null! Token ID is ${registryEntry.tokenId}`,
                );
              }

              // Parse the tokenURI; it's not really a ChainInformation but this is easie
              const info = JSON.parse(
                registryEntry.tokenURI,
              ) as IChainTokenInfo;
              const chainInfo = new ChainInformation(
                info.name,
                ChainId(info.chainId),
                info.hasGovernance,
                EthereumContractAddress(info.channelFactoryAddress),
                EthereumContractAddress(info.transferRegistryAddress),
                EthereumContractAddress(info.hypertokenAddress),
                EthereumContractAddress(info.messageTransferAddress),
                EthereumContractAddress(info.insuranceTransferAddress),
                EthereumContractAddress(info.parameterizedTransferAddress),
                info.hypernetGovernorAddress != null
                  ? EthereumContractAddress(info.hypernetGovernorAddress)
                  : null,
                info.registryFactoryAddress != null
                  ? EthereumContractAddress(info.registryFactoryAddress)
                  : null,
                info.gatewayRegistryAddress != null
                  ? EthereumContractAddress(info.gatewayRegistryAddress)
                  : null,
                info.liquidityRegistryAddress != null
                  ? EthereumContractAddress(info.liquidityRegistryAddress)
                  : null,
                info.tokenRegistryAddress != null
                  ? EthereumContractAddress(info.tokenRegistryAddress)
                  : null,
                info.chainRegistryAddress != null
                  ? EthereumContractAddress(info.chainRegistryAddress)
                  : null,
                info.providerUrls.map((providerUrl) =>
                  ProviderUrl(providerUrl),
                ),
              );

              // If this is the governance chain info, we'll stash that too
              if (chainInfo.chainId == config.governanceChainId) {
                this.governanceChainInfo = chainInfo;
              }

              return chainInfo;
            });
        });
    });
  }

  public getChainInformation(): ResultAsync<ChainInformation[], never> {
    return okAsync(this.chainInfo);
  }

  public getGovernanceChainInformation(): ResultAsync<ChainInformation, never> {
    return okAsync(this.governanceChainInfo);
  }
}

interface IChainTokenInfo {
  name: string;
  chainId: number;
  hasGovernance: boolean;
  channelFactoryAddress: string;
  transferRegistryAddress: string;
  hypertokenAddress: string;
  messageTransferAddress: string;
  insuranceTransferAddress: string;
  parameterizedTransferAddress: string;
  hypernetGovernorAddress: string | null;
  registryFactoryAddress: string | null;
  gatewayRegistryAddress: string | null;
  liquidityRegistryAddress: string | null;
  tokenRegistryAddress: string | null;
  chainRegistryAddress: string | null;
  providerUrls: string[];
}
