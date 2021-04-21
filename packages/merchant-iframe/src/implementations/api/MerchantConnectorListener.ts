import { ILogUtils } from "@hypernetlabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

import { IMerchantConnectorListener } from "@merchant-iframe/interfaces/api";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";

export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    protected contextProvider: IContextProvider,
    protected merchantService: IMerchantService,
    protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, Error> {
    const context = this.contextProvider.getMerchantContext();

    // Once the connector is activated, we need to listen to events
    // from the connector.
    context.onMerchantConnectorActivated.subscribe((connector) => {
      // Register event listeners
      if (connector.preRedirect != null) {
        connector.preRedirect.subscribe((redirectInfo) => {
          this.merchantService.prepareForRedirect(redirectInfo).mapErr((e) => {
            this.logUtils.error(e);
          });
        });
      }

      if (connector.signMessageRequested != null) {
        connector.signMessageRequested.subscribe((request) => {
          this.merchantService.signMessage(request.message, request.callback).mapErr((e) => {
            this.logUtils.error(e);
          });
        });
      }
    });

    return okAsync(undefined);
  }
}
