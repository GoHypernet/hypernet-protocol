import { MessagingError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMessagingListener {
  initialize(): ResultAsync<void, MessagingError>;
}

export const IMessagingListenerType = Symbol.for("IMessagingListener");
