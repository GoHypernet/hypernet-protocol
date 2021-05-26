import { IMessagingListener } from "@interfaces/api";
import {
    IConfigProvider,
    IConfigProviderType,
  IMessagingProvider,
  IMessagingProviderType,
} from "@interfaces/utilities";
import { ControlClaim, MessagingError } from "@hypernetlabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ILogUtils, ILogUtilsType, ResultUtils } from "@hypernetlabs/utils";
import { IControlService, IControlServiceType } from "@interfaces/business";

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
    return ResultUtils.combine([this.messagingProvider.getBasicMessaging(),
        this.configProvider.getConfig()]).map((vals) => {
            const [basicMessaging, config] = vals;
        basicMessaging.subscribe(config.controlClaimSubject, (controlClaim: ControlClaim) => {
            this.controlService.processControlClaim(controlClaim)
            .mapErr((e) => {
                this.logUtils.error(e);
            });
        });
    })
  }
}
