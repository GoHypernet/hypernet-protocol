import { ResultAsync } from "neverthrow";
import { MerchantConnectorError, MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";
import { IMerchantConnector, IRedirectInfo, IResolutionResult } from "@hypernetlabs/merchant-connector";
import { Balances, EthereumAddress, LogicalError, PaymentId, PublicIdentifier, Signature } from "@hypernetlabs/objects";

export interface IMerchantService {
  validateMerchantConnector(): ResultAsync<string, MerchantValidationError>;
  activateMerchantConnector(publicIdentifier: PublicIdentifier, balances: Balances): ResultAsync<IMerchantConnector, MerchantConnectorError | MerchantValidationError>;
  prepareForRedirect(redirectInfo: IRedirectInfo): ResultAsync<void, Error>;
  getMerchantUrl(): ResultAsync<string, MerchantValidationError>;
  autoActivateMerchantConnector(): ResultAsync<
    IMerchantConnector | null,
    MerchantConnectorError | MerchantValidationError
  >;
  publicIdentifierReceived(publicIdentifier: PublicIdentifier): ResultAsync<void, LogicalError>;
  getValidatedSignature(): ResultAsync<Signature, MerchantValidationError>;
  getAddress(): ResultAsync<EthereumAddress, MerchantValidationError>;
  resolveChallenge(paymentId: PaymentId): ResultAsync<IResolutionResult, MerchantConnectorError | MerchantValidationError>;
}
