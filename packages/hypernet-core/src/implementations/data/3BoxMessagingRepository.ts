import { IMessagingRepository } from "@interfaces/data";
import { Message, MessageThread } from "@interfaces/objects";
import { BoxSpace, openSpace } from "3box";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";

export class ThreeBoxMessagingRepository implements IMessagingRepository {
  constructor(protected boxUtils: IThreeBoxUtils) {}
  createMessageThread(): Promise<MessageThread> {
    throw new Error("Method not implemented.");
  }
  sendMessage(messageThread: MessageThread, message: Message): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
