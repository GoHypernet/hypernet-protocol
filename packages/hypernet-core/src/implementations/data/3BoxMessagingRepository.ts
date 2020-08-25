import { IMessagingRepository } from "@interfaces/data";
import { Message } from "@interfaces/objects";
import { BoxSpace, openSpace } from "3box";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";

export class ThreeBoxMessagingRepository implements IMessagingRepository {
  constructor(protected boxUtils: IThreeBoxUtils) {}

  public sendMessage(message: Message): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
