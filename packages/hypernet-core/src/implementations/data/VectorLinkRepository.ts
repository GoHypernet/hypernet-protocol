import { ILinkRepository } from "@interfaces/data";
import {
  HypernetConfig,
  HypernetLink,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  ResultAsync,
} from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError, VectorError } from "@interfaces/objects/errors";
import {
  IBrowserNode,
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { combine, okAsync } from "neverthrow";

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
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.vectorUtils.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [IBrowserNode, HypernetConfig, InitializedHypernetContext, string],
      RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
    >;

    let browserNode: IBrowserNode;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let channelAddress: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, context, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        if (activeTransfers.length === 0) {
          return okAsync([] as Payment[]);
        }

        return this.paymentUtils.transfersToPayments(activeTransfers, config, context, browserNode);
      })
      .andThen((payments) => {
        return this.linkUtils.paymentsToHypernetLinks(payments, context);
      });
  }

  /**
   * Given the ID of the link, return it.
   * @param counterpartyId The ID of the link to retrieve
   */
  public getHypernetLink(
    counterpartyId: PublicIdentifier,
  ): ResultAsync<HypernetLink, RouterChannelUnknownError | CoreUninitializedError | VectorError | Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.vectorUtils.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [IBrowserNode, HypernetConfig, InitializedHypernetContext, string],
      RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
    >;

    let browserNode: IBrowserNode;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let channelAddress: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, context, channelAddress] = vals;
        return browserNode.getActiveTransfers(channelAddress);
      })
      .andThen((activeTransfers) => {
        const filteredActiveTransfers = activeTransfers.filter((val) => {
          return val.responder === counterpartyId || val.initiator === counterpartyId;
        });

        // Because of the filter above, this should only produce a single link
        return this.paymentUtils.transfersToPayments(filteredActiveTransfers, config, context, browserNode);
      })
      .andThen((payments) => {
        return this.linkUtils.paymentsToHypernetLinks(payments, context);
      })
      .map((links) => {
        if (links.length === 0) {
          return new HypernetLink(counterpartyId, [], [], [], [], []);
        }

        return links[0];
      });
  }
}
