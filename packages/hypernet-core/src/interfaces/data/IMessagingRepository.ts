import { MessageThread, EthereumAddress, EstablishLinkRequest, MessagePayload } from "@interfaces/objects";

export interface IMessagingRepository {
  createMessageThread(threadName: string, consumer: EthereumAddress, provider: EthereumAddress): Promise<MessageThread>;
  getMessageThread(address: string): Promise<MessageThread>;
  getMessageThreadAddresses(): Promise<string[]>;
  sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void>;
  sendEstablishLinkRequest(request: EstablishLinkRequest): Promise<void>;
  sendDenyLinkResponse(linkRequest: EstablishLinkRequest): Promise<void>;
}
