import { PublicIdentifier } from "@objects/PublicIdentifier";
import { Payment } from "@objects/Payment";
import { PullPayment } from "@objects/PullPayment";
import { PushPayment } from "@objects/PushPayment";

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
