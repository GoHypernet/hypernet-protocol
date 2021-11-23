import { ILogUtils, ILogUtilsType } from "@hypernetlabs/utils";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IGatewayConnectorListener } from "@gateway-iframe/interfaces/api";
import {
  IGatewayService,
  IGatewayServiceType,
  IDisplayService,
  IDisplayServiceType,
  IPaymentService,
  IPaymentServiceType,
} from "@gateway-iframe/interfaces/business";
import {
  IContextProvider,
  IContextProviderType,
} from "@gateway-iframe/interfaces/utils";

@injectable()
export class GatewayConnectorListener implements IGatewayConnectorListener {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IGatewayServiceType) protected gatewayService: IGatewayService,
    @inject(IPaymentServiceType) protected paymentService: IPaymentService,
    @inject(IDisplayServiceType) protected displayService: IDisplayService,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public initialize(): ResultAsync<void, Error> {
    const context = this.contextProvider.getGatewayContext();

    // Once the connector is activated, we need to listen to events
    // from the connector.
    context.onGatewayConnectorActivated.subscribe((connector) => {
      // Register event listeners
      if (connector.signMessageRequested != null) {
        connector.signMessageRequested.subscribe((request) => {
          this.gatewayService
            .signMessage(request.message, request.callback)
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        });
      }

      if (connector.stateChannelRequested != null) {
        connector.stateChannelRequested.subscribe((request) => {
          this.gatewayService
            .assureStateChannel(
              request.chainId,
              request.routerPublicIdentifiers,
              request.callback,
            )
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        });
      }

      if (connector.getPaymentRequested != null) {
        connector.getPaymentRequested.subscribe((request) => {
          this.paymentService
            .getPayment(request.paymentId, request.callback)
            .mapErr((e) => {
              this.logUtils.error(e);
            });
        });
      }

      if (connector.initiateSendFundsRequested != null) {
        connector.initiateSendFundsRequested.subscribe((request) => {
          this.paymentService.initiateSendFunds(request).mapErr((e) => {
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

      if (connector.initiateAuthorizeFundsRequested != null) {
        connector.initiateAuthorizeFundsRequested.subscribe((request) => {
          this.paymentService.initiateAuthorizeFunds(request).mapErr((e) => {
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

      if (connector.resolveInsuranceRequested != null) {
        connector.resolveInsuranceRequested.subscribe((request) => {
          this.paymentService.resolveInsurance(request).mapErr((e) => {
            this.logUtils.error(e);
          });
        });
      }

      if (connector.displayRequested != null) {
        connector.displayRequested.subscribe(() => {
          this.displayService.displayRequested();
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
