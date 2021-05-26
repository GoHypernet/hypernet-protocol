import { IBasicMessaging } from "@connext/vector-types";
import { MessagingError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMessagingProvider {
  getBasicMessaging(): ResultAsync<IBasicMessaging, MessagingError>;
}

export const IMessagingProviderType = Symbol.for("IMessagingProvider");
