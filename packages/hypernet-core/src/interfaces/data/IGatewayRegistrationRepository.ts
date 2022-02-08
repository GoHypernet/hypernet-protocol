import {
  GatewayRegistrationFilter,
  GatewayRegistrationInfo,
  GatewayUrl,
  NonFungibleRegistryContractError,
  RegistryFactoryContractError,
  PersistenceError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IGatewayRegistrationRepository {
  /**
   * Returns a map of gateway URLs to their address
   * @param gatewayUrls
   */
  getGatewayRegistrationInfo(
    gatewayUrls: GatewayUrl[],
  ): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError | RegistryFactoryContractError
  >;

  /**
   * Returns a map of all gateway URLs to their registration information
   */
  getGatewayEntryList(): ResultAsync<
    Map<GatewayUrl, GatewayRegistrationInfo>,
    NonFungibleRegistryContractError | RegistryFactoryContractError
  >;

  getFilteredGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError>;
}

export const IGatewayRegistrationRepositoryType = Symbol.for(
  "IGatewayRegistrationRepository",
);
