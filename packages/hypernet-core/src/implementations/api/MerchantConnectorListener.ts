import {
  IAuthorizeFundsRequest,
  ISendFundsRequest,
} from "@hypernetlabs/merchant-connector";
import { MerchantUrl, PaymentId } from "@hypernetlabs/objects";
import {
  ILogUtils,
  ILogUtilsType,
  IValidationUtilsType,
  IValidationUtils,
} from "@hypernetlabs/utils";
import { BigNumber } from "ethers";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorListener } from "@interfaces/api";
import {
  IAccountService,
  IPaymentService,
  ILinkService,
  IAccountServiceType,
  IPaymentServiceType,
  ILinkServiceType,
} from "@interfaces/business";
import { IContextProvider, IContextProviderType } from "@interfaces/utilities";

@injectable()
export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IPaymentServiceType) protected paymentService: IPaymentService,
    @inject(ILinkServiceType) protected linkService: ILinkService,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IValidationUtilsType) protected validationUtils: IValidationUtils,
  ) {}

  public setup(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.onMerchantConnectorProxyActivated.subscribe((proxy) => {
        this.logUtils.debug(
          `Merchant connector proxy activated ${proxy.merchantUrl}`,
        );

        this._advanceMerchantRelatedPayments(proxy.merchantUrl);

        // When the merchant iframe wants a message signed, we can do it.
        proxy.signMessageRequested.subscribe((message) => {
          this.logUtils.debug(
            `Merchant Connector ${proxy.merchantUrl} requested to sign message ${message}`,
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

        proxy.sendFundsRequested.subscribe((request) => {
          this.logUtils.debug(
            `Merchant Connector ${proxy.merchantUrl} requested to send funds to ${request.recipientPublicIdentifier}`,
          );

          // Validate some things
          if (this.validateSendFundsRequest(request)) {
            this.paymentService
              .sendFunds(
                request.recipientPublicIdentifier,
                BigNumber.from(request.amount),
                request.expirationDate,
                BigNumber.from(request.requiredStake),
                request.paymentToken,
                proxy.merchantUrl,
              )
              .mapErr((e) => {
                this.logUtils.error(e);
              });
          } else {
            this.logUtils.error(
              `Invalid ISendFundsRequest from merchant connector ${proxy.merchantUrl}`,
            );
          }
        });

        proxy.authorizeFundsRequested.subscribe((request) => {
          this.logUtils.debug(
            `Merchant Connector ${proxy.merchantUrl} requested to authorize funds for ${request.recipientPublicIdentifier}`,
          );

          if (this.validateAuthorizeFundsRequest(request)) {
            this.paymentService
              .authorizeFunds(
                request.recipientPublicIdentifier,
                BigNumber.from(request.totalAuthorized),
                request.expirationDate,
                BigNumber.from(request.deltaAmount),
                request.deltaTime,
                BigNumber.from(request.requiredStake),
                request.paymentToken,
                proxy.merchantUrl,
              )
              .mapErr((e) => {
                this.logUtils.error(e);
              });
          } else {
            this.logUtils.error(
              `Invalid IAuthorizeFundsRequest from merchant connector ${proxy.merchantUrl}`,
            );
          }
        });
      });
    });
  }

  protected _advanceMerchantRelatedPayments(merchantUrl: MerchantUrl): void {
    this.logUtils.debug(`Advancing payments for ${merchantUrl}`);
    this.linkService
      .getLinks()
      .map((links) => {
        const paymentIds = new Array<PaymentId>();
        for (const link of links) {
          for (const payment of link.payments) {
            if (payment.merchantUrl === merchantUrl) {
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
}
