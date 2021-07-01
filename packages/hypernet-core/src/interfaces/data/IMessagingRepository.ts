import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMessagingRepository {
  sendControlClaim(
    controlClaim: ControlClaim,
  ): ResultAsync<void, MessagingError>;
}

export const IMessagingRepositoryType = Symbol.for("IMessagingRepository");
