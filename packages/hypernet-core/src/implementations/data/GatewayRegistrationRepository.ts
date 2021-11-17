import {
  BlockchainUnavailableError,
  GatewayUrl,
  PersistenceError,
  GatewayRegistrationInfo,
  GatewayRegistrationFilter,
  Signature,
  EthereumAccountAddress,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  IAjaxUtils,
  ILogUtils,
  IAjaxUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { IGatewayRegistrationRepository } from "@interfaces/data";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IBlockchainUtils,
  IBlockchainUtilsType,
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IVectorUtils,
  IVectorUtilsType,
} from "@interfaces/utilities";
import { injectable, inject } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
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
    @inject(IBlockchainUtilsType) protected blockchainUtils: IBlockchainUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {
    this.gatewayRegistrationInfoMap = new Map();
  }

  public getGatewayRegistrationInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    BlockchainUnavailableError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      const gatewayRegistryAddress =
        config.chainAddresses[config.governanceChainId]?.gatewayRegistryAddress;
      if (gatewayRegistryAddress == null) {
        return errAsync(
          new BlockchainUnavailableError(
            `Unable to getGatewayRegistrationInfo for chain ${config.governanceChainId}. No configuration info for that chain is available`,
          ),
        );
      }

      const returnInfo = new Map<GatewayUrl, GatewayRegistrationInfo>();
      const newGatewayResults = new Array<
        ResultAsync<void, BlockchainUnavailableError>
      >();

      // Check for entries that are already cached.
      for (const gatewayUrl of gatewayUrls) {
        const cachedRegistration =
          this.gatewayRegistrationInfoMap.get(gatewayUrl);
        if (cachedRegistration != null) {
          returnInfo.set(gatewayUrl, cachedRegistration);
        } else {
          // We need to get the registration info that's not in the cache
          newGatewayResults.push(
            this.blockchainUtils
              .getERC721Entry<IGatewayRegistryEntry>(
                gatewayRegistryAddress,
                gatewayUrl,
              )
              .map((registryEntry) => {
                // Convert the registry entry
                const registrationInfo = new GatewayRegistrationInfo(
                  gatewayUrl,
                  registryEntry.address,
                  registryEntry.signature,
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
