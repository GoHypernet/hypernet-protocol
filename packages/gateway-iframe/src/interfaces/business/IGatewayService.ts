import {
  IGatewayConnector,
  IRedirectInfo,
  IResolutionResult,
  IResolveInsuranceRequest,
} from "@hypernetlabs/gateway-connector";
import {
  Balances,
  EthereumAddress,
  LogicalError,
  PaymentId,
  PublicIdentifier,
  Signature,
  GatewayUrl,
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
  ): ResultAsync<void, LogicalError>;
  getValidatedSignature(): ResultAsync<Signature, GatewayValidationError>;
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
}

export const IGatewayServiceType = Symbol.for("IGatewayService");
