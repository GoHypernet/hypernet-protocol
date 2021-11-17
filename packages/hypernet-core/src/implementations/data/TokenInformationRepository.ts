import {
  RegistryEntry,
  NonFungibleRegistryContractError,
  TokenInformation,
  EthereumContractAddress,
  ChainId,
} from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { ITokenInformationRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

import { IConfigProvider, IConfigProviderType } from "@interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class TokenInformationRepository implements ITokenInformationRepository {
  protected tokenInformation = new Map<
    ChainId,
    Map<EthereumContractAddress, TokenInformation>
  >();

  constructor(
    @inject(IContractFactoryType) protected contractFactory: IContractFactory,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, NonFungibleRegistryContractError> {
    return this.configProvider.getConfig().andThen((config) => {
      return this.contractFactory
        .factoryNonFungibleRegistryEnumerableUpgradeableContract(
          config.governanceChainInformation.tokenRegistryAddress,
        )
        .andThen((nonFungibleRegistryContract) => {
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
                  .andThen<
                    RegistryEntry | null,
                    NonFungibleRegistryContractError
                  >((tokenId) => {
                    return nonFungibleRegistryContract.getRegistryEntryByTokenId(
                      tokenId,
                    );
                  })
                  .orElse(() => {
                    return okAsync(null);
                  });

                registryEntryListResult.push(registryEntryResult);
              }
              return ResultUtils.combine(registryEntryListResult);
            })
            .map((registryEntriesOrNulls) => {
              registryEntriesOrNulls
                .filter((val) => {
                  return val != null;
                })
                .map((registryEntry) => {
                  if (registryEntry == null) {
                    throw new Error(
                      "Oh no! Bear is driving! How can this be?!",
                    );
                  }
                  if (registryEntry.tokenURI == null) {
                    throw new Error(
                      `Invalid entry in Token Registry. The tokenURI is null! Token ID is ${registryEntry.tokenId}`,
                    );
                  }

                  // Parse the tokenURI; it's not really a TokenInformation but this is easie
                  const info = JSON.parse(registryEntry.tokenURI) as ITokenInfo;
                  const chainId = ChainId(info.chainId);
                  const address = EthereumContractAddress(info.address);
                  const tokenInfo = new TokenInformation(
                    info.name,
                    info.symbol,
                    chainId,
                    address,
                    info.nativeToken,
                    info.erc20,
                    info.decimals,
                    info.logoUrl,
                  );

                  // Get the map for this token's chain. Create it if necessary
                  let chainMap = this.tokenInformation.get(chainId);
                  if (chainMap == null) {
                    chainMap = new Map<
                      EthereumContractAddress,
                      TokenInformation
                    >();
                    this.tokenInformation.set(chainId, chainMap);
                  }

                  // Store the token information
                  chainMap.set(address, tokenInfo);
                });
            });
        });
    });
  }

  public getTokenInformation(): ResultAsync<TokenInformation[], never> {
    // findInTokenInformation is really just a recursive iterator, so if we just return true for everything, we get the whole contents as an array
    return okAsync(this.findInTokenInformation(() => true));
  }

  public getTokenInformationForChain(
    chainId: ChainId,
  ): ResultAsync<TokenInformation[], never> {
    const chainMap = this.tokenInformation.get(chainId);

    if (chainMap == null) {
      return okAsync([]);
    }

    return okAsync(Array.from(chainMap.values()));
  }

  public getTokenInformationByAddress(
    tokenAddress: EthereumContractAddress,
  ): ResultAsync<TokenInformation | null, never> {
    const tokens = this.findInTokenInformation((token) => {
      return token.address == tokenAddress;
    });

    if (tokens.length > 0) {
      return okAsync(tokens[0]);
    }
    return okAsync(null);
  }

  // Sort of like Unix's find command, it will iterate over the whole tokenInformation map o' maps
  protected findInTokenInformation(
    selector: (ti: TokenInformation) => boolean,
  ): TokenInformation[] {
    return Array.from(this.tokenInformation.values()).reduce((prev, cur) => {
      for (const tokenInfo of cur.values()) {
        if (selector(tokenInfo)) {
          prev.push(tokenInfo);
        }
      }
      return prev;
    }, new Array<TokenInformation>());
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
