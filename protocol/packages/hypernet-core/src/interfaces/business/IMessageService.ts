import { EthereumAddress, MessagePayload } from "@interfaces/objects";

export interface IMessageService {
  messageRecieved(message: MessagePayload): Promise<void>;
  sendMessage(destination: EthereumAddress, payload: MessagePayload): Promise<void>;
}
