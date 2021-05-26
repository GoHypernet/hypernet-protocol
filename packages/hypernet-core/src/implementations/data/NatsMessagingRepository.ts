import { IMessagingRepository } from "@interfaces/data";
import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import {
  IConfigProvider,
  IConfigProviderType,
  IMessagingProvider,
  IMessagingProviderType,
} from "@interfaces/utilities";
import { ResultUtils } from "@hypernetlabs/utils";

@injectable()
export class NatsMessagingRepository implements IMessagingRepository {
  constructor(
    @inject(IMessagingProviderType)
    protected messagingProvider: IMessagingProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public sendControlClaim(
    controlClaim: ControlClaim,
  ): ResultAsync<void, MessagingError> {
    return ResultUtils.combine([
      this.messagingProvider.getBasicMessaging(),
      this.configProvider.getConfig(),
    ]).map((vals) => {
      const [basicMessaging, config] = vals;
      basicMessaging.publish(config.controlClaimSubject, controlClaim);
    });
  }
}
