import { EMessageTransferType } from "@objects/typing/EMessageTransferType";

export interface IMessageTransferData {
  messageType: EMessageTransferType;
  requireOnline: boolean;
}
