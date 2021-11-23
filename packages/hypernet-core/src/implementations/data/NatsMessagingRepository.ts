import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { ResultUtils } from "@hypernetlabs/utils";
import { IMessagingRepository } from "@interfaces/data";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  IMessagingProvider,
  IMessagingProviderType,
} from "@interfaces/utilities";

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
