import { IGatewayConnector } from "@hypernetlabs/gateway-connector";
import {
  Balances,
  PublicIdentifier,
  Signature,
  GatewayUrl,
  ChainId,
  EthereumAddress,
  UUID,
  GatewayTokenInfo,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

import {
  GatewayConnectorError,
  GatewayValidationError,
} from "@gateway-iframe/interfaces/objects/errors";

export interface IGatewayService {
  validateGatewayConnector(): ResultAsync<string, GatewayValidationError>;
  activateGatewayConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<
    IGatewayConnector,
    GatewayConnectorError | GatewayValidationError
  >;
  getGatewayUrl(): ResultAsync<GatewayUrl, GatewayValidationError>;
  autoActivateGatewayConnector(): ResultAsync<
    IGatewayConnector | null,
    GatewayConnectorError | GatewayValidationError
  >;
  publicIdentifierReceived(
    publicIdentifier: PublicIdentifier,
  ): ResultAsync<void, never>;
  getValidatedSignature(): ResultAsync<Signature, GatewayValidationError>;
  getGatewayTokenInfo(): ResultAsync<
    GatewayTokenInfo[],
    GatewayValidationError | GatewayConnectorError
  >;
  deauthorize(): ResultAsync<
    void,
    GatewayConnectorError | GatewayValidationError
  >;
  signMessage(
    message: string,
    callback: (message: string, signature: Signature) => void,
  ): ResultAsync<void, never>;
  messageSigned(
    message: string,
    signature: Signature,
  ): ResultAsync<void, never>;

  assureStateChannel(
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
    callback: (channelAddress: EthereumAddress) => void,
  ): ResultAsync<void, never>;
  stateChannelAssured(
    id: UUID,
    channelAddress: EthereumAddress,
  ): ResultAsync<void, never>;
}

export const IGatewayServiceType = Symbol.for("IGatewayService");
