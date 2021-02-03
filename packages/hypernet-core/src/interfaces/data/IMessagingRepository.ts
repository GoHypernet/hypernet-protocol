import {
  ControlClaim,
  EstablishLinkRequest,
  EthereumAddress,
  MessagePayload,
  MessageThread,
  ResultAsync,
} from "@interfaces/objects";
import { BlockchainUnavailableError, LogicalError, ThreeBoxError } from "@interfaces/objects/errors";

export interface IMessagingRepository {
  createMessageThread(
    threadName: string,
    localUser: EthereumAddress,
    remoteUser: EthereumAddress,
  ): ResultAsync<MessageThread, BlockchainUnavailableError | ThreeBoxError>;
  getMessageThread(address: string): ResultAsync<MessageThread, BlockchainUnavailableError | ThreeBoxError>;
  getMessageThreadAddresses(): ResultAsync<string[], BlockchainUnavailableError | ThreeBoxError>;
  sendMessage(
    destination: EthereumAddress,
    payload: MessagePayload,
  ): ResultAsync<void, BlockchainUnavailableError | ThreeBoxError | LogicalError>;
  sendEstablishLinkRequest(
    request: EstablishLinkRequest,
  ): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
  sendDenyLinkResponse(
    linkRequest: EstablishLinkRequest,
  ): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
  sendControlClaim(controlClaim: ControlClaim): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError>;
}