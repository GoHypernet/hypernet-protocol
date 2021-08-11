import {
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { GatewayUrl, PaymentId } from "@hypernetlabs/objects";
import {
  ILogUtils,
  ILogUtilsType,
  IValidationUtilsType,
  IValidationUtils,
} from "@hypernetlabs/utils";
import { IGatewayConnectorListener } from "@interfaces/api";
import {
  IAccountService,
  IPaymentService,
  ILinkService,
  IAccountServiceType,
  IPaymentServiceType,
  ILinkServiceType,
  IGatewayConnectorService,
} from "@interfaces/business";
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { Subscription } from "rxjs";

import { IContextProvider, IContextProviderType } from "@interfaces/utilities";

@injectable()
export class GatewayConnectorListener implements IGatewayConnectorListener {
  protected signMessageRequestedSubscriptionMap = new Map<
    GatewayUrl,
    Subscription
  >();
  protected sendFundsRequestedSubscriptionMap = new Map<
    GatewayUrl,
    Subscription
  >();
  protected authorizeFundsRequestedSubscriptionMap = new Map<
    GatewayUrl,
    Subscription
  >();
  protected resolveInsuranceRequestedSubscriptionMap = new Map<
    GatewayUrl,
    Subscription
  >();
  protected stateChannelRequestedSubscriptionMap = new Map<
    GatewayUrl,
    Subscription
  >();

  constructor(
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IGatewayConnectorServiceType)
    protected gatewayConnectorService: IGatewayConnectorService,
    @inject(IPaymentServiceType) protected paymentService: IPaymentService,
    @inject(ILinkServiceType) protected linkService: ILinkService,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IValidationUtilsType) protected validationUtils: IValidationUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.onGatewayConnectorProxyActivated.subscribe((proxy) => {
        this.logUtils.debug(
          `Gateway connector proxy activated ${proxy.gatewayUrl}`,
        );

        this._advanceGatewayRelatedPayments(proxy.gatewayUrl);

        // When the gateway iframe wants a message signed, we can do it.
        const signMessageRequestedSubscription =
          proxy.signMessageRequested.subscribe((message) => {
            this.logUtils.debug(
              `Gateway Connector ${proxy.gatewayUrl} requested to sign message ${message}`,
            );

            this.accountService
              .signMessage(message)
              .andThen((signature) => {
                return proxy.messageSigned(message, signature);
              })
              .mapErr((e) => {
                this.logUtils.error(e);
              });
          });

        this.signMessageRequestedSubscriptionMap.set(
          proxy.gatewayUrl,
          signMessageRequestedSubscription,
        );

        const stateChannelRequestedSubscription =
          proxy.stateChannelRequested.subscribe((request) => {
            this.logUtils.debug(
              `Gateway Connector ${proxy.gatewayUrl} requested a state channel with chain ${request.chainId}`,
            );

            this.gatewayConnectorService
              .ensureStateChannel(
                proxy.gatewayUrl,
                request.chainId,
                request.routerPublicIdentifiers,
              )
              .andThen((channelAddress) => {
                return proxy.returnStateChannel(request.id, channelAddress);
              })
              .mapErr((e) => {
                this.logUtils.error(e);
              });
          });

        this.stateChannelRequestedSubscriptionMap.set(
          proxy.gatewayUrl,
          stateChannelRequestedSubscription,
        );

        const sendFundsRequestedSubscription =
          proxy.sendFundsRequested.subscribe((request) => {
            this.logUtils.debug(
              `Gateway Connector ${proxy.gatewayUrl} requested to send funds to ${request.recipientPublicIdentifier}`,
            );

            // Validate some things
            if (this.validateSendFundsRequest(request)) {
              this.paymentService
                .sendFunds(
                  request.channelAddress,
                  request.recipientPublicIdentifier,
                  request.amount,
                  request.expirationDate,
                  request.requiredStake,
                  request.paymentToken,
                  proxy.gatewayUrl,
                  request.metadata,
                )
                .mapErr((e) => {
                  this.logUtils.error(e);
                });
            } else {
              this.logUtils.error(
                `Invalid ISendFundsRequest from gateway connector ${proxy.gatewayUrl}`,
              );
            }
          });

        this.sendFundsRequestedSubscriptionMap.set(
          proxy.gatewayUrl,
          sendFundsRequestedSubscription,
        );

        const authorizeFundsRequestedSubscription =
          proxy.authorizeFundsRequested.subscribe((request) => {
            this.logUtils.debug(
              `Gateway Connector ${proxy.gatewayUrl} requested to authorize funds for ${request.recipientPublicIdentifier}`,
            );

            if (this.validateAuthorizeFundsRequest(request)) {
              this.paymentService
                .authorizeFunds(
                  request.channelAddress,
                  request.recipientPublicIdentifier,
                  request.totalAuthorized,
                  request.expirationDate,
                  request.deltaAmount,
                  request.deltaTime,
                  request.requiredStake,
                  request.paymentToken,
                  proxy.gatewayUrl,
                  request.metadata,
                )
                .mapErr((e) => {
                  this.logUtils.error(e);
                });
            } else {
              this.logUtils.error(
                `Invalid IAuthorizeFundsRequest from gateway connector ${proxy.gatewayUrl}`,
              );
            }
          });

        this.authorizeFundsRequestedSubscriptionMap.set(
          proxy.gatewayUrl,
          authorizeFundsRequestedSubscription,
        );

        const resolveInsuranceRequestedSubscription =
          proxy.resolveInsuranceRequested.subscribe((request) => {
            this.logUtils.debug(
              `Gateway Connector ${proxy.gatewayUrl} requested to resolve insurance for payment ${request.paymentId}`,
            );

            if (this.validateResolveInsuranceRequest(request)) {
              this.paymentService
                .resolveInsurance(
                  request.paymentId,
                  request.amount,
                  request.gatewaySignature,
                )
                .mapErr((e) => {
                  this.logUtils.error(e);
                });
            } else {
              this.logUtils.error(
                `Invalid IResolveInsuranceRequest from gateway connector ${proxy.gatewayUrl}`,
              );
            }
          });

        this.resolveInsuranceRequestedSubscriptionMap.set(
          proxy.gatewayUrl,
          resolveInsuranceRequestedSubscription,
        );
      });

      // Stop listening for gateway connector events when gateway deauthorization starts
      context.onGatewayDeauthorizationStarted.subscribe((gatewayUrl) => {
        this.signMessageRequestedSubscriptionMap.get(gatewayUrl)?.unsubscribe();
        this.sendFundsRequestedSubscriptionMap.get(gatewayUrl)?.unsubscribe();
        this.authorizeFundsRequestedSubscriptionMap
          .get(gatewayUrl)
          ?.unsubscribe();
        this.resolveInsuranceRequestedSubscriptionMap
          .get(gatewayUrl)
          ?.unsubscribe();
        this.stateChannelRequestedSubscriptionMap
          .get(gatewayUrl)
          ?.unsubscribe();
      });
    });
  }

  protected _advanceGatewayRelatedPayments(gatewayUrl: GatewayUrl): void {
    this.logUtils.debug(`Advancing payments for ${gatewayUrl}`);
    this.linkService
      .getLinks()
      .map((links) => {
        const paymentIds = new Array<PaymentId>();
        for (const link of links) {
          for (const payment of link.payments) {
            if (payment.gatewayUrl === gatewayUrl) {
              paymentIds.push(payment.id);
            }
          }
        }
        return this.paymentService.advancePayments(paymentIds);
      })
      .mapErr((e) => {
        this.logUtils.error(e);
      });
  }

  protected validateSendFundsRequest(request: ISendFundsRequest): boolean {
    if (
      !this.validationUtils.validatePublicIdentifier(
        request.recipientPublicIdentifier,
      )
    ) {
      return false;
    }

    if (!this.validationUtils.validateEthereumAddress(request.paymentToken)) {
      return false;
    }

    if (!this.validationUtils.validateWeiAmount(request.amount)) {
      return false;
    }

    if (!this.validationUtils.validateWeiAmount(request.requiredStake)) {
      return false;
    }

    // Verify that the expiration date is sometime in the future
    const now = Math.floor(new Date().getTime() / 1000);
    if (now >= request.expirationDate) {
      return false;
    }

    return true;
  }

  protected validateAuthorizeFundsRequest(
    request: IAuthorizeFundsRequest,
  ): boolean {
    if (
      !this.validationUtils.validatePublicIdentifier(
        request.recipientPublicIdentifier,
      )
    ) {
      return false;
    }

    if (!this.validationUtils.validateEthereumAddress(request.paymentToken)) {
      return false;
    }

    if (!this.validationUtils.validateWeiAmount(request.totalAuthorized)) {
      return false;
    }

    if (!this.validationUtils.validateWeiAmount(request.deltaAmount)) {
      return false;
    }

    if (request.deltaTime < 0) {
      return false;
    }

    if (!this.validationUtils.validateWeiAmount(request.requiredStake)) {
      return false;
    }

    // Verify that the expiration date is sometime in the future
    const now = Math.floor(new Date().getTime() / 1000);
    if (now < request.expirationDate) {
      return false;
    }

    return true;
  }

  protected validateResolveInsuranceRequest(
    request: IResolveInsuranceRequest,
  ): boolean {
    if (!this.validationUtils.validatePaymentId(request.paymentId)) {
      return false;
    }

    if (
      !BigNumber.from(request.amount).isZero() &&
      request.gatewaySignature == null
    ) {
      return false;
    }

    return true;
  }
}
function IGatewayConnectorServiceType(IGatewayConnectorServiceType: any) {
  throw new Error("Function not implemented.");
}
