import { NonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/contracts";
import {
  RegistryEntry,
  NonFungibleRegistryContractError,
  TokenInformation,
  EthereumContractAddress,
  ProviderUrl,
  ChainId,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { ITokenInformationUtils } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
} from "@interfaces/utilities";

@injectable()
export class TokenInformationRepository implements ITokenInformationRepository {
  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getTokenInformation(): ResultAsync<TokenInformation[], never> {
    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceProvider(),
      this.configProvider.getConfig(),
    ]).andThen(([provider, config]) => {
      const nonFungibleRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          config.tokenRegistryAddress,
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
                  `Invalid entry in Token Registry. The tokenURI is null! Token ID is ${registryEntry.tokenId}`,
                );
              }

              // Parse the tokenURI; it's not really a TokenInformation but this is easie
              const info = JSON.parse(
                registryEntry.tokenURI,
              ) as IChainTokenInfo;
              const chainInfo = new TokenInformation(
                info.name,
                info.symbol,
                ChainId(info.chainId),
                EthereumContractAddress(info.address),
                info.nativeToken,
                info.erc20,
                info.decimals,
                info.logoUrl
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
}

interface ITokenInfo {
  name: string;
  symbol: string;
  chainId: number;
  address: string;
  nativeToken: boolean;
  erc20: boolean;
  decimals: number;
  logoUrl: string;
}
