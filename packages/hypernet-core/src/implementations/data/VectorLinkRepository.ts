import { ResultUtils } from "@implementations/utilities";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink, Payment, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError, VectorError } from "@interfaces/objects/errors";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { okAsync } from "neverthrow";

/**
 * Provides methods for retrieving Hypernet Links.
 */
export class VectorLinkRepository implements ILinkRepository {
  /**
   * Get an instance of the VectorLinkRepository
   */
  constructor(
    protected browserNodeProvider: IBrowserNodeProvider,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
    protected vectorUtils: IVectorUtils,
    protected paymentUtils: IPaymentUtils,
    protected linkUtils: ILinkUtils,
  ) {}

  /**
   * Get all Hypernet Links for this client
   */
  public getHypernetLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.vectorUtils.getRouterChannelAddress()])
      .andThen((vals) => {
        const [browserNode, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        if (activeTransfers.length === 0) {
          return okAsync([] as Payment[]);
        }

        return this.paymentUtils.transfersToPayments(activeTransfers);
      })
      .andThen((payments) => {
        return this.linkUtils.paymentsToHypernetLinks(payments);
      });
  }

  /**
   * Given the ID of the link, return it.
   * @param counterpartyId The ID of the link to retrieve
   */
  public getHypernetLink(
    counterpartyId: PublicIdentifier,
  ): ResultAsync<HypernetLink, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.vectorUtils.getRouterChannelAddress()])
      .andThen((vals) => {
        const [browserNode, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        const filteredActiveTransfers = activeTransfers.filter((val) => {
          return val.responder === counterpartyId || val.initiator === counterpartyId;
        });

        // Because of the filter above, this should only produce a single link
        return this.paymentUtils.transfersToPayments(filteredActiveTransfers);
      })
      .andThen((payments) => {
        return this.linkUtils.paymentsToHypernetLinks(payments);
      })
      .map((links) => {
        if (links.length === 0) {
          return new HypernetLink(counterpartyId, [], [], [], [], []);
        }

        return links[0];
      });
  }
}
