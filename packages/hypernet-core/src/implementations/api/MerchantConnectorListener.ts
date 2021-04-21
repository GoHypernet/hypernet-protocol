import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorListener } from "@interfaces/api";
import { IAccountService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";

export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    protected accountService: IAccountService,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {}

  public setup(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.onMerchantConnectorProxyActivated.subscribe((proxy) => {
        proxy.signMessageRequested.subscribe((message) => {
          this.accountService
            .signMessage(message)
            .andThen((signature) => {
              return proxy.messageSigned(message, signature);
            })
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        });
      });
    });
  }
}
