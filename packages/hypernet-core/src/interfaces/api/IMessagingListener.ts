import { MessagingError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMessagingListener {
  setup(): ResultAsync<void, MessagingError>;
}
