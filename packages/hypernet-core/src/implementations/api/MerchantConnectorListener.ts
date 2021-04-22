import { IMerchantConnectorListener } from "@interfaces/api";
import { IAccountService, IPaymentService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";
import { ILogUtils } from "@hypernetlabs/utils";
import { ResultAsync } from "neverthrow";

export class MerchantConnectorListener implements IMerchantConnectorListener {
  constructor(
    protected accountService: IAccountService,
    protected paymentService: IPaymentService,
    protected contextProvider: IContextProvider,
    protected logUtils: ILogUtils,
  ) {}

  public setup(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.onMerchantConnectorProxyActivated.subscribe((proxy) => {
        this._setupUnresolvedPayments(proxy);
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

  private _setupUnresolvedPayments(proxy) {
    proxy.getMerchantUrl().andThen((merchantUrl) => {
      this.paymentService.advanceMerchantUnresolvedPayments(merchantUrl);
    });
  }
}
