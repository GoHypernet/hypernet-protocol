import {
  BlockchainUnavailableError,
  GatewayRegistrationFilter,
  GatewayRegistrationInfo,
  GatewayUrl,
  PersistenceError,
  VectorError,
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
    BlockchainUnavailableError | VectorError
  >;

  getFilteredGatewayRegistrationInfo(
    filter?: GatewayRegistrationFilter,
  ): ResultAsync<GatewayRegistrationInfo[], PersistenceError>;
}

export const IGatewayRegistrationRepositoryType = Symbol.for(
  "IGatewayRegistrationRepository",
);
