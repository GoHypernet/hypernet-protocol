import { HypernetLink, InitializedHypernetContext, Payment, PublicIdentifier, PullPayment, PushPayment } from "@interfaces/objects";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";

export class LinkUtils implements ILinkUtils {
  /**
   * Given an array of Vector transfers, return the corresponding Hypernet Payments.
   * Internally, calls transfersToPayments()
   * @param payments
   * @param config
   * @param context
   * @param browserNode
   */
  public async paymentsToHypernetLinks(
    payments: Payment[],
    context: InitializedHypernetContext,
  ): Promise<HypernetLink[]> {
    const linksByCounterpartyId = new Map<string, HypernetLink>();

    for (const payment of payments) {
      // Now that it's converted, we can stick it in the hypernet link
      const counterpartyId: PublicIdentifier = payment.to === context.publicIdentifier ? payment.from : payment.to;
      let link = linksByCounterpartyId.get(counterpartyId);
      if (link == null) {
        link = new HypernetLink(counterpartyId, [], [], [], [], []);
        linksByCounterpartyId.set(counterpartyId, link);
      }

      link.payments.push(payment);

      if (payment instanceof PullPayment) {
        link.pullPayments.push(payment);
        link.activePullPayments.push(payment);
      } else if (payment instanceof PushPayment) {
        link.pushPayments.push(payment);
        link.activePushPayments.push(payment);
      } else {
        throw new Error("Unknown payment type!");
      }
    }

    // Convert to an array for return
    return Array.from(linksByCounterpartyId.values());
  }
}