import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { IMessagingListener } from "@interfaces/api";
import { IControlService, IControlServiceType } from "@interfaces/business";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  IMessagingProvider,
  IMessagingProviderType,
} from "@interfaces/utilities";

@injectable()
export class NatsMessagingListener implements IMessagingListener {
  constructor(
    @inject(IControlServiceType) protected controlService: IControlService,
    @inject(IMessagingProviderType)
    protected messagingProvider: IMessagingProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public setup(): ResultAsync<void, MessagingError> {
    this.logUtils.debug("Initializing NATS messaging listener");
    // return ResultUtils.combine([
    //   this.messagingProvider.getBasicMessaging(),
    //   this.configProvider.getConfig(),
    // ]).map((vals) => {
    //   const [basicMessaging, config] = vals;
    //   basicMessaging.subscribe(
    //     config.controlClaimSubject,
    //     (controlClaim: ControlClaim) => {
    //       this.controlService.processControlClaim(controlClaim).mapErr((e) => {
    //         this.logUtils.error(e);
    //       });
    //     },
    //   );
    // });
    return okAsync(undefined);
  }
}
