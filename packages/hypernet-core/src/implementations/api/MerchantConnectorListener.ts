import { MerchantUrl, PaymentId } from "@hypernetlabs/objects";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

import { IMerchantConnectorListener } from "@interfaces/api";
import {
  IAccountService,
  IPaymentService,
  ILinkService,
} from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";

export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    protected accountService: IAccountService,
    protected paymentService: IPaymentService,
    protected linkService: ILinkService,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {}

  public setup(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.onMerchantConnectorProxyActivated.subscribe((proxy) => {
        this._advanceMerchantRelatedPayments(proxy.merchantUrl);
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

  private _advanceMerchantRelatedPayments(merchantUrl: MerchantUrl) {
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
}
