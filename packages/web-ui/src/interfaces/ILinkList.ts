import { PublicIdentifier, Payment, PullPayment, PushPayment } from "@hypernetlabs/hypernet-core";

export interface ILinkList {
  counterPartyAccount: PublicIdentifier;
  payments: Payment[];
  pushPayments: PushPayment[];
  pullPayments: PullPayment[];
  activePushPayments: PushPayment[];
  activePullPayments: PullPayment[];
}
