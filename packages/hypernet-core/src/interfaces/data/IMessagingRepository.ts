import {
  MessageThread,
  EthereumAddress,
  EstablishLinkRequest,
  MessagePayload,
  ControlClaim,
} from "@interfaces/objects";

/**
 * @todo do we need the messaging repository anymore? delete entirely?
 */
export interface IMessagingRepository {
  createMessageThread(threadName: string, consumer: EthereumAddress, provider: EthereumAddress): Promise<MessageThread>;
  getMessageThread(address: string): Promise<MessageThread>;
  getMessageThreadAddresses(): Promise<string[]>;
  sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void>;
  sendEstablishLinkRequest(request: EstablishLinkRequest): Promise<void>;
  sendDenyLinkResponse(linkRequest: EstablishLinkRequest): Promise<void>;
  sendControlClaim(controlClaim: ControlClaim): Promise<void>;
}
