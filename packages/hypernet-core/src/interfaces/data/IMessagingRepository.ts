import { Message, MessageThread, EthereumAddress, EstablishLinkRequest } from "@interfaces/objects";

export interface IMessagingRepository {
  createMessageThread(threadName: string, consumer: EthereumAddress, provider: EthereumAddress): Promise<MessageThread>;
  getMessageThread(address: string): Promise<MessageThread>;
  getMessageThreadAddresses(): Promise<string[]>;
  sendMessage(messageThread: MessageThread, message: Message): Promise<void>;
  sendEstablishLinkRequest(request: EstablishLinkRequest): Promise<void>;
}
