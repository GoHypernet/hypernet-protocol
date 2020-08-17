import { IMessagingRepository } from "@interfaces/data";
import { Message } from "@interfaces/objects";
import { BoxSpace, openSpace } from "3box";

export class ThreeBoxMessagingRepository implements IMessagingRepository {
  protected box: BoxSpace;

  constructor() {
    this.box = openSpace("SomeSpaceName");
  }

  public sendMessage(message: Message): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
