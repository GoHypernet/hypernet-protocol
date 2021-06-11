import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { IMerchantConnectorListener } from "@merchant-iframe/interfaces/api";
import {
  IMerchantService,
  IMerchantServiceType,
  IDisplayService,
  IDisplayServiceType,
  IPaymentService,
  IPaymentServiceType,
} from "@merchant-iframe/interfaces/business";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IContextProvider,
  IContextProviderType,
} from "@merchant-iframe/interfaces/utils";
import { IFrameHeight } from "@web-integration/../../objects/src/IFrameHeight";

@injectable()
export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IMerchantServiceType) protected merchantService: IMerchantService,
    @inject(IPaymentServiceType) protected paymentService: IPaymentService,
    @inject(IDisplayServiceType) protected displayService: IDisplayService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
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
          this.merchantService
            .signMessage(request.message, request.callback)
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        });
      }

      if (connector.sendFundsRequested != null) {
        connector.sendFundsRequested.subscribe((request) => {
          this.paymentService.sendFunds(request).mapErr((e) => {
            this.logUtils.error(e);
          });
        });
      }

      if (connector.authorizeFundsRequested != null) {
        connector.authorizeFundsRequested.subscribe((request) => {
          this.paymentService.authorizeFunds(request).mapErr((e) => {
            this.logUtils.error(e);
          });
        });
      }

      if (connector.displayRequested != null) {
        connector.displayRequested.subscribe(() => {
          this.displayService.displayRequested();
          // We need setTimeout here because if the merchant is using some frontend library like react,
          // we might need to wait for the react application to get renederd and after that update the height
          setTimeout(() => {
            this.displayService.heightUpdated(
              IFrameHeight(document.body.offsetHeight),
            );
          }, 100);
        });
      }

      if (connector.closeRequested != null) {
        connector.closeRequested.subscribe(() => {
          this.displayService.closeRequested();
        });
      }
    });

    return okAsync(undefined);
  }
}
