import { NonFungibleRegistryEnumerableUpgradeableContract } from "@hypernetlabs/governance-sdk";
import {
  BlockchainUnavailableError,
  GatewayUrl,
  PersistenceError,
  GatewayRegistrationInfo,
  GatewayRegistrationFilter,
  Signature,
  EthereumAccountAddress,
  NonFungibleRegistryContractError,
  RegistryEntry,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  IAjaxUtils,
  ILogUtils,
  IAjaxUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { IGatewayRegistrationRepository } from "@interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";
import {
  IGatewayConnectorProxyFactory,
  IGatewayConnectorProxyFactoryType,
} from "@interfaces/utilities/factory";

@injectable()
export class GatewayRegistrationRepository
  implements IGatewayRegistrationRepository
{
  protected gatewayRegistrationInfoMap: Map<
    GatewayUrl,
    GatewayRegistrationInfo
  >;

  constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IAjaxUtilsType) protected ajaxUtils: IAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVectorUtilsType) protected vectorUtils: IVectorUtils,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IGatewayConnectorProxyFactoryType)
    protected gatewayConnectorProxyFactory: IGatewayConnectorProxyFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.gatewayRegistrationInfoMap = new Map();
  }

  public getGatewayRegistrationInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).andThen(([config, provider]) => {
      const returnInfo = new Map<GatewayUrl, GatewayRegistrationInfo>();
      const newGatewayResults = new Array<
        ResultAsync<void, NonFungibleRegistryContractError>
      >();

      const gatewayRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          config.governanceChainInformation.gatewayRegistryAddress,
        );

      // Check for entries that are already cached.
      for (const gatewayUrl of gatewayUrls) {
        const cachedRegistration =
          this.gatewayRegistrationInfoMap.get(gatewayUrl);
        if (cachedRegistration != null) {
          returnInfo.set(gatewayUrl, cachedRegistration);
        } else {
          // We need to get the registration info that's not in the cache
          newGatewayResults.push(
            gatewayRegistryContract
              .getRegistryEntryByLabel(gatewayUrl)
              .map((registryEntry) => {
                // Convert the registry entry
                if (registryEntry.tokenURI == null) {
                  throw new Error(
                    `Gateway registry entry for ${gatewayUrl} is invalid, it does not have a tokenURI`,
                  );
                }

                const parsedEntry = JSON.parse(
                  registryEntry.tokenURI,
                ) as IGatewayRegistryEntry;

                const registrationInfo = new GatewayRegistrationInfo(
                  gatewayUrl,
                  parsedEntry.address,
                  parsedEntry.signature,
                );

                // Set it into the return info
                returnInfo.set(gatewayUrl, registrationInfo);
                this.gatewayRegistrationInfoMap.set(
                  gatewayUrl,
                  registrationInfo,
                );
              }),
          );
        }
      }

      // Wait for all the new results, and return the final list
      return ResultUtils.combine(newGatewayResults).map(() => {
        return returnInfo;
      });
    });
  }

  public getGatewayEntryList(): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.blockchainProvider.getGovernanceProvider(),
    ]).andThen(([config, provider]) => {
      const gatewayRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          config.governanceChainInformation.gatewayRegistryAddress,
        );

      return gatewayRegistryContract.totalSupply().andThen((totalCount) => {
        // if all gateways are cached, we return them directly.
        if (this.gatewayRegistrationInfoMap.size === totalCount) {
          return okAsync(this.gatewayRegistrationInfoMap);
        } else {
          const registryEntryListResults: ResultAsync<
            RegistryEntry,
            NonFungibleRegistryContractError
          >[] = [];

          for (let i = 0; i < totalCount; i++) {
            const registryEntryResult = gatewayRegistryContract
              .tokenByIndex(i)
              .andThen((tokenId) => {
                return gatewayRegistryContract.getRegistryEntryByTokenId(
                  tokenId,
                );
              });

            registryEntryListResults.push(registryEntryResult);
          }

          return ResultUtils.combine(registryEntryListResults).map(
            (registryEntries) => {
              const returnInfo = new Map<GatewayUrl, GatewayRegistrationInfo>();

              // Check for entries that are already cached.
              for (const registryEntry of registryEntries) {
                const gatewayUrl = GatewayUrl(registryEntry.label);
                const cachedRegistration =
                  this.gatewayRegistrationInfoMap.get(gatewayUrl);
                if (cachedRegistration != null) {
                  returnInfo.set(gatewayUrl, cachedRegistration);
                } else {
                  // Convert the registry entry
                  if (registryEntry.tokenURI == null) {
                    throw new Error(
                      `Gateway registry entry for ${gatewayUrl} is invalid, it does not have a tokenURI`,
                    );
                  }

                  const parsedEntry = JSON.parse(
                    registryEntry.tokenURI,
                  ) as IGatewayRegistryEntry;

                  const registrationInfo = new GatewayRegistrationInfo(
                    gatewayUrl,
                    parsedEntry.address,
                    parsedEntry.signature,
                  );

                  // Set it into the return info
                  returnInfo.set(gatewayUrl, registrationInfo);
                  this.gatewayRegistrationInfoMap.set(
                    gatewayUrl,
                    registrationInfo,
                  );
                }
              }

              return returnInfo;
            },
          );
        }
      });
    });
  }

  public getFilteredGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}

interface IGatewayRegistryEntry {
  address: EthereumAccountAddress;
  signature: Signature;
}
