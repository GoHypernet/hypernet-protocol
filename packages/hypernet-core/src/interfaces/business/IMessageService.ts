import { Message } from "@interfaces/objects";

export interface IMessageService {
  messageRecieved(channelId: string, message: Message): Promise<void>;
  sendMessage(message: Message): Promise<void>;
}
