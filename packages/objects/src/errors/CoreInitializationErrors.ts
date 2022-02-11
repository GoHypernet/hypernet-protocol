import { MessagingError } from "@objects/errors/MessagingError";
import { BlockchainUnavailableError } from "@objects/errors/BlockchainUnavailableError";
import { VectorError } from "@objects/errors/VectorError";
import { RouterChannelUnknownError } from "@objects/errors/RouterChannelUnknownError";
import { GatewayConnectorError } from "@objects/errors/GatewayConnectorError";
import { GatewayValidationError } from "@objects/errors/GatewayValidationError";
import { PersistenceError } from "@objects/errors/PersistenceError";
import { ProxyError } from "@objects/errors/ProxyError";
import { InvalidPaymentError } from "@objects/errors/InvalidPaymentError";
import { InvalidParametersError } from "@objects/errors/InvalidParametersError";
import { InvalidPaymentIdError } from "@objects/errors/InvalidPaymentIdError";
import { GovernanceSignerUnavailableError } from "@objects/errors/GovernanceSignerUnavailableError";
import { TransferResolutionError } from "@objects/errors/TransferResolutionError";
import { TransferCreationError } from "@objects/errors/TransferCreationError";
import { PaymentStakeError } from "@objects/errors/PaymentStakeError";
import { PaymentFinalizeError } from "@objects/errors/PaymentFinalizeError";
import { NonFungibleRegistryContractError } from "@objects/errors/NonFungibleRegistryContractError";
import { IPFSUnavailableError } from "@objects/errors/IPFSUnavailableError";
import { RegistryFactoryContractError } from "@objects/errors/RegistryFactoryContractError";

export type CoreInitializationErrors =
  | MessagingError
  | BlockchainUnavailableError
  | VectorError
  | RouterChannelUnknownError
  | GatewayConnectorError
  | GatewayValidationError
  | PersistenceError
  | ProxyError
  | InvalidPaymentError
  | InvalidParametersError
  | InvalidPaymentIdError
  | GovernanceSignerUnavailableError
  | TransferResolutionError
  | TransferCreationError
  | PaymentStakeError
  | PaymentFinalizeError
  | NonFungibleRegistryContractError
  | RegistryFactoryContractError
  | IPFSUnavailableError;
