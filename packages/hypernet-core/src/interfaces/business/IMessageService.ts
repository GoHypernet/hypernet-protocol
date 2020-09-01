import { Message, EthereumAddress } from "@interfaces/objects";

export interface IMessageService {
  messageRecieved(message: Message): Promise<void>;
  sendMessage(destination: EthereumAddress, data: any): Promise<Message>;
}
