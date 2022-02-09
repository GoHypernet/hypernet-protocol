import {
  NonFungibleRegistryEnumerableUpgradeableContract,
  RegistryFactoryContract,
} from "@hypernetlabs/governance-sdk";
import {
  GatewayUrl,
  PersistenceError,
  GatewayRegistrationInfo,
  GatewayRegistrationFilter,
  Signature,
  EthereumAccountAddress,
  NonFungibleRegistryContractError,
  RegistryEntry,
  RegistryFactoryContractError,
  EthereumContractAddress,
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
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IRegistryUtils,
  IRegistryUtilsType,
  IStorageUtils,
  IStorageUtilsType,
} from "@interfaces/data/utilities";
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
    @inject(IRegistryUtilsType) protected registryUtils: IRegistryUtils,
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
    NonFungibleRegistryContractError | RegistryFactoryContractError
  > {
    const returnInfo = new Map<GatewayUrl, GatewayRegistrationInfo>();
    const newGatewayResults = new Array<
      ResultAsync<void, NonFungibleRegistryContractError>
    >();

    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceProvider(),
      this.getGatewayRegistryAddress(),
    ]).andThen(([provider, gatewayRegistryAddress]) => {
      const gatewayRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          gatewayRegistryAddress,
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
    NonFungibleRegistryContractError | RegistryFactoryContractError
  > {
    return ResultUtils.combine([
      this.blockchainProvider.getGovernanceProvider(),
      this.getGatewayRegistryAddress(),
    ]).andThen(([provider, gatewayRegistryAddress]) => {
      const gatewayRegistryContract =
        new NonFungibleRegistryEnumerableUpgradeableContract(
          provider,
          gatewayRegistryAddress,
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

  private getGatewayRegistryAddress(): ResultAsync<
    EthereumContractAddress,
    RegistryFactoryContractError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      const gatewaysRegistryName =
        context.governanceChainInformation.registryNames.gateways;
      if (gatewaysRegistryName == null) {
        throw new Error("Gateways registry name not found!");
      }

      return this.registryUtils.getRegistryNameAddress(gatewaysRegistryName);
    });
  }
}

interface IGatewayRegistryEntry {
  address: EthereumAccountAddress;
  signature: Signature;
}
