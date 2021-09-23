import { UtilityMessageSignature } from "@hypernetlabs/objects";

export interface ISignMessageRequest {
  message: string;
  callback: (message: string, signature: UtilityMessageSignature) => void;
}
