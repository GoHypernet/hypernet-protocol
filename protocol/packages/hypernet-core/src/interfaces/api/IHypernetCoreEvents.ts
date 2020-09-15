import { HypernetLink, Deposit, Payment, Stake, Withdrawal } from "@interfaces/objects";
import { Observable } from "rxjs";

export interface IHypernetworkCoreEvents {
  onPaymentReceived: Observable<Payment>;
  onChannelOpened: Observable<HypernetLink>;

  // onAccountsRequested(): Promise<string[]>;
  // onSignTransactionRequested(txParams: PartialTxParams): Promise<string>;
  // onSignPersonalMessageRequested(data: string, address: string): Promise<string>;
  // onSignTypedDataRequested(address: string, typedData: any): Promise<string>;
  // onSignTypedDataV4Requested(address: string, typedData: ITypedData): Promise<string>;

  // // This event happens when we receive a request to open a channel from a provider. This event
  // // requires an answer, either true or false, as to allow the channel to be opened.
  // // This is the hook for the Provider UI to approve or deny a channel open request.
  // // TODO: Deprecate? See #782
  // onConsumerRequestOpenAuth(channel: Channel): Promise<boolean>;
  // onNewDepositRequest(deposit: Deposit): Promise<boolean>;

  // // Information-only events
  // onProviderApproveOpenAuthRequest(channel: Channel);
  // onProviderRejectsOpenAuthRequest(id: number);
  // onConsumerPayment(payment: Payment);
  // onNewDepositApproval(deposit: Deposit);
  // onNewDepositRejection(id: number);
  // onCloseChannelApproval(channel: Channel);
  // onChannelCreated(channel: Channel);
  // onChannelClosed(channel: Channel);
  // onChannelDeposit(deposit: Deposit);
  // onProviderWithdrawal(withdrawal: Withdrawal);
  // onStakeDeposit(stake: Stake);
  // onStakeWithdrawal(stake: Stake);
  // onCapacityModified(token: Token);
}
