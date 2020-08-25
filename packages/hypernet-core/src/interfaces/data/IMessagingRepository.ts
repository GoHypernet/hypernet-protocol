import { Message, MessageThread } from "@interfaces/objects";

export interface IMessagingRepository {
  createMessageThread(): Promise<MessageThread>;
  sendMessage(messageThread: MessageThread, message: Message): Promise<void>;
}
