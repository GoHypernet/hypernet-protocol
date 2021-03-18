import td from "testdouble";
import { IPaymentUtils } from "@interfaces/utilities";
import { EPaymentType, ETransferType } from "@hypernetlabs/objects/types";
import { okAsync } from "neverthrow";
import { commonPaymentId, insuranceTransferId, offerTransferId, parameterizedTransferId, unixPast } from "@mock/mocks";
import { PushPayment, SortedTransfers, IFullTransferState } from "@hypernetlabs/objects";
import { BrowserNodeProviderMock } from "./BrowserNodeProviderMock";

export class PaymentUtilsMockFactory {
  static factoryPaymentUtils(
    browserNodeProvider: BrowserNodeProviderMock,
    proposedPayment: PushPayment,
    stakedPayment: PushPayment,
    approvedPayment: PushPayment,
  ): IPaymentUtils {
    const paymentUtils = td.object<IPaymentUtils>();

    td.when(paymentUtils.createPaymentId(EPaymentType.Push)).thenReturn(okAsync(commonPaymentId));

    td.when(
      paymentUtils.transfersToPayment(
        commonPaymentId,
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 1 && arr[0].transferId === offerTransferId;
        }),
      ),
    ).thenReturn(okAsync(proposedPayment));

    td.when(
      paymentUtils.transfersToPayment(
        commonPaymentId,
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 2;
        }),
      ),
    ).thenReturn(okAsync(stakedPayment));

    td.when(
      paymentUtils.transfersToPayment(
        commonPaymentId,
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 3;
        }),
      ),
    ).thenReturn(okAsync(approvedPayment));

    td.when(paymentUtils.getTransferTypeWithTransfer(td.matchers.contains({ transferId: offerTransferId }))).thenReturn(
      okAsync({ transferType: ETransferType.Offer, transfer: browserNodeProvider.offerTransfer }),
    );
    td.when(
      paymentUtils.getTransferTypeWithTransfer(td.matchers.contains({ transferId: insuranceTransferId })),
    ).thenReturn(okAsync({ transferType: ETransferType.Insurance, transfer: browserNodeProvider.insuranceTransfer }));
    td.when(
      paymentUtils.getTransferTypeWithTransfer(td.matchers.contains({ transferId: parameterizedTransferId })),
    ).thenReturn(
      okAsync({ transferType: ETransferType.Parameterized, transfer: browserNodeProvider.parameterizedTransfer }),
    );

    td.when(
      paymentUtils.transfersToPayments(
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 0;
        }),
      ),
    ).thenReturn(okAsync([]));

    td.when(
      paymentUtils.transfersToPayments(
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 1 && arr[0].transferId === offerTransferId;
        }),
      ),
    ).thenReturn(okAsync([proposedPayment]));

    td.when(
      paymentUtils.transfersToPayments(
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 3;
        }),
      ),
    ).thenReturn(okAsync([approvedPayment]));

    td.when(
      paymentUtils.sortTransfers(
        commonPaymentId,
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 1 && arr[0].transferId === offerTransferId;
        }),
      ),
    ).thenReturn(
      okAsync(new SortedTransfers(browserNodeProvider.offerTransfer, null, null, [], browserNodeProvider.offerDetails)),
    );

    td.when(
      paymentUtils.sortTransfers(
        commonPaymentId,
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr.length == 3;
        }),
      ),
    ).thenReturn(
      okAsync(
        new SortedTransfers(
          browserNodeProvider.offerTransfer,
          browserNodeProvider.insuranceTransfer,
          browserNodeProvider.parameterizedTransfer,
          [],
          browserNodeProvider.offerDetails,
        ),
      ),
    );

    td.when(
      paymentUtils.getEarliestDateFromTransfers(
        td.matchers.argThat((arr: IFullTransferState[]) => {
          return arr[0].transferId === offerTransferId;
        }),
      ),
    ).thenReturn(unixPast);

    return paymentUtils;
  }
}
