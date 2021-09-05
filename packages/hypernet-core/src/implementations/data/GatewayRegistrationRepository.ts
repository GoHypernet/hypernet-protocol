import {
  PullPayment,
  PushPayment,
  ProxyError,
  BlockchainUnavailableError,
  EthereumAddress,
  Signature,
  GatewayUrl,
  Balances,
  AuthorizedGatewaysSchema,
  GatewayConnectorError,
  GatewayValidationError,
  GatewayActivationError,
  GatewayAuthorizationDeniedError,
  PersistenceError,
  GatewayRegistrationInfo,
  GatewayTokenInfo,
  GatewayRegistrationFilter,
} from "@hypernetlabs/objects";
import {
  ResultUtils,
  IAjaxUtils,
  ILogUtils,
  IAjaxUtilsType,
  ILogUtilsType,
} from "@hypernetlabs/utils";
import { IGatewayRegistrationRepository } from "@interfaces/data";
import { InitializedHypernetContext } from "@interfaces/objects";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IStorageUtils, IStorageUtilsType } from "@interfaces/data/utilities";
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
            .getGatewayRegistrationInfo(gatewayUrl)
            .map((registrationInfo) => {
              returnInfo.set(gatewayUrl, registrationInfo);
              this.gatewayRegistrationInfoMap.set(gatewayUrl, registrationInfo);
            }),
        );
      }
    }

    // Wait for all the new results, and return the final list
    return ResultUtils.combine(newGatewayResults).map(() => {
      return returnInfo;
    });
  }

  public getFilteredGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
