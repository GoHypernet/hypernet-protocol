import { PublicIdentifier, Payment, PullPayment, PushPayment } from "@interfaces/objects";

export class HypernetLink {
  constructor(
    public counterPartyAccount: PublicIdentifier,
    public payments: Payment[],
    public pushPayments: PushPayment[],
    public pullPayments: PullPayment[],
    public activePushPayments: PushPayment[],
    public activePullPayments: PullPayment[],
  ) {}
}
