import { Signature } from "@hypernetlabs/objects";

export interface ISignMessageRequest {
  message: string;
  callback: (message: string, signature: Signature) => void;
}
