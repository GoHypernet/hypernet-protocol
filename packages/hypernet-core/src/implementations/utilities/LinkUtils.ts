import {
  HypernetLink,
  Payment,
  PublicIdentifier,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
import { InvalidParametersError } from "@hypernetlabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IContextProvider } from "@interfaces/utilities";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";

/**
 * Provides functions to go from a set of payments into a set of HypernetLinks, and similar.
 */
export class LinkUtils implements ILinkUtils {
  constructor(protected contextProvider: IContextProvider) {}
  /**
   * Given an array of Payment objects, return the corresponding Hypernet Links
   * Internally, calls transfersToPayments()
   * @param payments the payments to get the associated Links for
   * @param context instance of HypernetContext
   */
  public paymentsToHypernetLinks(
    payments: Payment[],
  ): ResultAsync<HypernetLink[], InvalidParametersError> {
    return this.contextProvider.getInitializedContext().andThen((context) => {
      const linksByCounterpartyId = new Map<string, HypernetLink>();

      for (const payment of payments) {
        // Now that it's converted, we can stick it in the hypernet link
        const counterpartyId: PublicIdentifier =
          payment.to === context.publicIdentifier ? payment.from : payment.to;
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
          return errAsync(new InvalidParametersError("Unknown payment type!"));
        }
      }

      // Convert to an array for return
      return okAsync(Array.from(linksByCounterpartyId.values()));
    });
  }
}
