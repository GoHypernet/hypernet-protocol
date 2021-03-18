import { EMessageType } from "@objects/types";
import "reflect-metadata";
import { Transform, Type } from "class-transformer";

export class MessagePayload {
  @Transform((input) => EMessageType[input.value])
  public type: EMessageType;

  @Type(() => String)
  public data: string;

  constructor(type: EMessageType, data: string) {
    this.type = type;
    this.data = data;
  }
}
