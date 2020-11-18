import { PublicIdentifier, Payment, PullPayment, PushPayment } from "@interfaces/objects";

export class HypernetLedger {
  constructor(public id: string,
    public counterPartyAccount: PublicIdentifier,
    public payments: Payment[],
    public pushPayments: PushPayment[],
    public pullPayments: PullPayment[],
    public activePushPayments: PushPayment[],
    public activePullPayments: PullPayment[]) {
  }
}