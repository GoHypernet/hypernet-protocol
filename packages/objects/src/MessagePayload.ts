import { Transform, Type } from "class-transformer";

import { EMessageType } from "@objects/typing";

import "reflect-metadata";

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
