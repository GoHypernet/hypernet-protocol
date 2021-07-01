import {
  IGatewayConnector,
  IRedirectInfo,
  IResolutionResult,
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
  MerchantConnectorError,
  MerchantValidationError,
} from "@gateway-iframe/interfaces/objects/errors";

export interface IGatewayService {
  validateMerchantConnector(): ResultAsync<string, MerchantValidationError>;
  activateMerchantConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<
    IGatewayConnector,
    MerchantConnectorError | MerchantValidationError
  >;
  prepareForRedirect(redirectInfo: IRedirectInfo): ResultAsync<void, Error>;
  getMerchantUrl(): ResultAsync<GatewayUrl, MerchantValidationError>;
  autoActivateMerchantConnector(): ResultAsync<
    IGatewayConnector | null,
    MerchantConnectorError | MerchantValidationError
  >;
  publicIdentifierReceived(
    publicIdentifier: PublicIdentifier,
  ): ResultAsync<void, LogicalError>;
  getValidatedSignature(): ResultAsync<Signature, MerchantValidationError>;
  getAddress(): ResultAsync<EthereumAddress, MerchantValidationError>;
  resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<
    IResolutionResult,
    MerchantConnectorError | MerchantValidationError
  >;
  deauthorize(): ResultAsync<
    void,
    MerchantConnectorError | MerchantValidationError
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

export const IMerchantServiceType = Symbol.for("IGatewayService");
