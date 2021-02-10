import { ResultUtils } from "@implementations/utilities";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink, Payment, PublicIdentifier, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError, VectorError } from "@interfaces/objects/errors";
import {
  IBrowserNode,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  ITimeUtils,
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
    protected timeUtils: ITimeUtils,
  ) {}

  /**
   * Get all Hypernet Links for this client
   */
  public getHypernetLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    let browserNode: IBrowserNode;

    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.vectorUtils.getRouterChannelAddress()])
      .andThen((vals) => {
        let channelAddress: string;
        [browserNode, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        // We also need to look for potentially resolved transfers
        const earliestDate = this.paymentUtils.getEarliestDateFromTransfers(activeTransfers);

        return browserNode.getTransfers(earliestDate, this.timeUtils.getUnixNow());
      })
      .andThen((transfers) => {
        if (transfers.length === 0) {
          return okAsync([] as Payment[]);
        }

        return this.paymentUtils.transfersToPayments(transfers);
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
    let browserNode: IBrowserNode;
    return ResultUtils.combine([this.browserNodeProvider.getBrowserNode(), this.vectorUtils.getRouterChannelAddress()])
      .andThen((vals) => {
        let channelAddress: string;
        [browserNode, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        // We also need to look for potentially resolved transfers
        const earliestDate = this.paymentUtils.getEarliestDateFromTransfers(activeTransfers);

        return browserNode.getTransfers(earliestDate, this.timeUtils.getUnixNow());
      })
      .andThen((transfers) => {
        const filteredActiveTransfers = transfers.filter((val) => {
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
