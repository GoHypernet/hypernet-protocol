import { Message } from "@interfaces/objects";

export interface IMessagingRepository {
  sendMessage(message: Message): Promise<void>;
}
