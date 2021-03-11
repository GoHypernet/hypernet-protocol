import { IMerchantConnectorListener } from "@merchant-iframe/interfaces/api";
import { IMerchantService } from "@merchant-iframe/interfaces/business";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { okAsync, ResultAsync } from "neverthrow";

export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(protected contextProvider: IContextProvider, protected merchantService: IMerchantService) {}

  public initialize(): ResultAsync<void, Error> {
    const context = this.contextProvider.getMerchantContext();

    // Once the connecto is activated, we need to listen to events
    // from the connector.
    context.onMerchantConnectorActivated.subscribe((connector) => {
      // Register event listeners
      connector.onPreRedirect.subscribe((redirectInfo) => {
        this.merchantService.prepareForRedirect(redirectInfo);
      });
    });

    return okAsync(undefined);
  }
}
