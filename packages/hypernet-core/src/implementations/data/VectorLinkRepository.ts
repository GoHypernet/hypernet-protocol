import { BrowserNode } from "@connext/vector-browser-node";
import { FullTransferState, NodeError } from "@connext/vector-types";
import { ILinkRepository } from "@interfaces/data";
import {
  HypernetConfig,
  HypernetLink,
  InitializedHypernetContext,
  Payment,
  PublicIdentifier,
  ResultAsync,
} from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";
import { combine, errAsync, okAsync } from "neverthrow";

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
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  > {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.vectorUtils.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, InitializedHypernetContext, string],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let channelAddress: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, context, channelAddress] = vals;
        return ResultAsync.fromPromise(browserNode.getActiveTransfers({ channelAddress }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((activeTransfersRes) => {
        if (activeTransfersRes.isError) {
          return errAsync(activeTransfersRes.getError() as NodeError);
        }

        const activeTransfers = activeTransfersRes.getValue() as FullTransferState[];

        if (activeTransfers.length === 0) {
          return okAsync([] as Payment[]);
        }

        return this.paymentUtils.transfersToPayments(
          activeTransfers as FullTransferState[],
          config,
          context,
          browserNode,
        );
      })
      .andThen((paymentsUnk) => {
        const payments = paymentsUnk as Payment[];
        return this.linkUtils.paymentsToHypernetLinks(payments, context);
      });
  }

  /**
   * Given the ID of the link, return it.
   * @param counterpartyId The ID of the link to retrieve
   */
  public getHypernetLink(
    counterpartyId: PublicIdentifier,
  ): ResultAsync<HypernetLink, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error> {
    const prerequisites = (combine([
      this.browserNodeProvider.getBrowserNode(),
      this.configProvider.getConfig(),
      this.contextProvider.getInitializedContext(),
      this.vectorUtils.getRouterChannelAddress() as ResultAsync<any, any>,
    ]) as unknown) as ResultAsync<
      [BrowserNode, HypernetConfig, InitializedHypernetContext, string],
      RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
    >;

    let browserNode: BrowserNode;
    let config: HypernetConfig;
    let context: InitializedHypernetContext;
    let channelAddress: string;

    return prerequisites
      .andThen((vals) => {
        [browserNode, config, context, channelAddress] = vals;
        return ResultAsync.fromPromise(browserNode.getActiveTransfers({ channelAddress }), (e) => {
          return e as NodeError;
        });
      })
      .andThen((activeTransfersRes) => {
        if (activeTransfersRes.isError) {
          return errAsync(activeTransfersRes.getError() as NodeError);
        }

        const activeTransfers = activeTransfersRes.getValue().filter((val) => {
          return val.responder === counterpartyId || val.initiator === counterpartyId;
        });

        // Because of the filter above, this should only produce a single link
        return this.paymentUtils.transfersToPayments(
          activeTransfers as FullTransferState[],
          config,
          context,
          browserNode,
        );
      })
      .andThen((paymentsUnk) => {
        const payments = paymentsUnk as Payment[];
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
