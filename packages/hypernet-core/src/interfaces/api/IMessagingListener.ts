import { Message } from "@interfaces/objects";

export interface IMessagingListener {
  onMessageRecieved(callback: (message: Message) => void): void;
}
