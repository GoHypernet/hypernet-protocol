import { EMessageType } from "@interfaces/types";
import { Transform, Type } from "class-transformer";

export class MessagePayload {
  @Transform((input) => EMessageType[input])
  public type: EMessageType;

  @Type(() => String)
  public data: string;

  constructor(type: EMessageType, data: string) {
    this.type = type;
    this.data = data;
  }
}
