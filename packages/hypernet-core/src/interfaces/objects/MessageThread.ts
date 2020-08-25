import { Message } from "./Message";

export class MessageThread {
  constructor(public threadAddress: string, public messages: Message[]) {}
}
