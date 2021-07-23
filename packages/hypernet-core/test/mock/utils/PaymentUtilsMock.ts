import {
  EPaymentType,
  ETransferType,
  PushPayment,
  SortedTransfers,
  IFullTransferState,
  EPaymentState,
} from "@hypernetlabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import { BrowserNodeProviderMock } from "./BrowserNodeProviderMock";

import { IPaymentUtils } from "@interfaces/utilities";
import {
  commonPaymentId,
  insuranceTransferId,
  offerTransferId,
  parameterizedTransferId,
  unixPast,
} from "@mock/mocks";

export class PaymentUtilsMockFactory {
  static factoryPaymentUtils(
    browserNodeProvider: BrowserNodeProviderMock,
    proposedPayment: PushPayment,
    stakedPayment: PushPayment,
    approvedPayment: PushPayment,
  ): IPaymentUtils {
    const paymentUtils = td.object<IPaymentUtils>();

    td.when(paymentUtils.createPaymentId(EPaymentType.Push)).thenReturn(
      okAsync(commonPaymentId),
    );

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
      okAsync(
        new SortedTransfers(
          [browserNodeProvider.offerTransfer],
          [],
          [],
          [],
          browserNodeProvider.offerDetails,
        ),
      ),
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
          [browserNodeProvider.offerTransfer],
          [browserNodeProvider.insuranceTransfer],
          [browserNodeProvider.parameterizedTransfer],
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
    ).thenReturn(unixPast as never);

    // getPaymentState is just a simple state machine
    td.when(
      paymentUtils.getPaymentState(
        td.matchers.argThat((arg: SortedTransfers) => {
          return (
            arg.parameterizedTransfers != null &&
            arg.parameterizedTransfers.length > 0 &&
            arg.insuranceTransfers != null &&
            arg.insuranceTransfers.length > 0 &&
            arg.offerTransfers != null &&
            arg.offerTransfers.length > 0
          );
        }),
      ),
    ).thenReturn(EPaymentState.Approved);

    td.when(
      paymentUtils.getPaymentState(
        td.matchers.argThat((arg: SortedTransfers) => {
          return (
            arg.parameterizedTransfers != null &&
            arg.parameterizedTransfers.length == 0 &&
            arg.insuranceTransfers != null &&
            arg.insuranceTransfers.length > 0 &&
            arg.offerTransfers != null &&
            arg.offerTransfers.length > 0
          );
        }),
      ),
    ).thenReturn(EPaymentState.Staked);

    td.when(
      paymentUtils.getPaymentState(
        td.matchers.argThat((arg: SortedTransfers) => {
          return (
            arg.parameterizedTransfers != null &&
            arg.parameterizedTransfers.length == 0 &&
            arg.insuranceTransfers != null &&
            arg.insuranceTransfers.length == 0 &&
            arg.offerTransfers != null &&
            arg.offerTransfers.length > 0
          );
        }),
      ),
    ).thenReturn(EPaymentState.Proposed);

    return paymentUtils;
  }
}
