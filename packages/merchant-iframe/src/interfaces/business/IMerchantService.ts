import { ResultAsync } from "neverthrow";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IMerchantConnector, IRedirectInfo, IResolutionResult } from "@hypernetlabs/merchant-connector";
import {
  Balances,
  EthereumAddress,
  LogicalError,
  PaymentId,
  PublicIdentifier,
  Signature,
  MerchantUrl,
} from "@hypernetlabs/objects";

export interface IMerchantService {
  validateMerchantConnector(): ResultAsync<string, MerchantValidationError>;
  activateMerchantConnector(
    publicIdentifier: PublicIdentifier,
    balances: Balances,
  ): ResultAsync<IMerchantConnector, MerchantConnectorError | MerchantValidationError>;
  prepareForRedirect(redirectInfo: IRedirectInfo): ResultAsync<void, Error>;
  getMerchantUrl(): ResultAsync<MerchantUrl, MerchantValidationError>;
  autoActivateMerchantConnector(): ResultAsync<
    IMerchantConnector | null,
    MerchantConnectorError | MerchantValidationError
  >;
  publicIdentifierReceived(publicIdentifier: PublicIdentifier): ResultAsync<void, LogicalError>;
  getValidatedSignature(): ResultAsync<Signature, MerchantValidationError>;
  getAddress(): ResultAsync<EthereumAddress, MerchantValidationError>;
  resolveChallenge(
    paymentId: PaymentId,
  ): ResultAsync<IResolutionResult, MerchantConnectorError | MerchantValidationError>;
  signMessage(message: string, callback: (message: string, signature: Signature) => void): ResultAsync<void, never>;
  messageSigned(message: string, signature: Signature): ResultAsync<void, never>;
}
