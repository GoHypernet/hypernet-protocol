import { FullTransferState } from "@connext/vector-types";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink, Payment, PublicIdentifier } from "@interfaces/objects";
import {
  IBrowserNodeProvider,
  IConfigProvider,
  IContextProvider,
  IPaymentUtils,
  IVectorUtils,
} from "@interfaces/utilities";
import { ILinkUtils } from "@interfaces/utilities/ILinkUtils";

export class VectorLinkRepository implements ILinkRepository {
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
  public async getHypernetLinks(): Promise<HypernetLink[]> {
    const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    const channelAddressPromise = await this.vectorUtils.getRouterChannelAddress();
    const configPromise = await this.configProvider.getConfig();
    const contextPromise = await this.contextProvider.getInitializedContext();

    const [browserNode, channelAddress, config, context] = await Promise.all([
      browserNodePromise,
      channelAddressPromise,
      configPromise,
      contextPromise,
    ]);

    const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress });

    if (activeTransfersRes.isError) {
      const error = activeTransfersRes.getError();
      throw error;
    }

    const activeTransfers = activeTransfersRes.getValue() as FullTransferState[]

    if (activeTransfers.length == 0) return []

    const payments = await this.paymentUtils.transfersToPayments(
      activeTransfers as FullTransferState[],
      config,
      context,
      browserNode,
    );

    return await this.linkUtils.paymentsToHypernetLinks(payments, context);
  }

  /**
   * Given the ID of the link, return it.
   * @param counterpartyId The ID of the link to retrieve
   */
  public async getHypernetLink(counterpartyId: PublicIdentifier): Promise<HypernetLink> {
    const browserNodePromise = await this.browserNodeProvider.getBrowserNode();
    const channelAddressPromise = await this.vectorUtils.getRouterChannelAddress();
    const configPromise = await this.configProvider.getConfig();
    const contextPromise = await this.contextProvider.getInitializedContext();

    const [browserNode, channelAddress, config, context] = await Promise.all([
      browserNodePromise,
      channelAddressPromise,
      configPromise,
      contextPromise,
    ]);

    const activeTransfersRes = await browserNode.getActiveTransfers({ channelAddress });

    if (activeTransfersRes.isError) {
      const error = activeTransfersRes.getError();
      throw error;
    }

    const activeTransfers = activeTransfersRes.getValue().filter((val) => {
      return val.meta.to === counterpartyId || val.meta.from === counterpartyId;
    });

    // Because of the filter above, this should only produce a single link
    const payments = await this.paymentUtils.transfersToPayments(
      activeTransfers as FullTransferState[],
      config,
      context,
      browserNode,
    );
    const links = await this.linkUtils.paymentsToHypernetLinks(payments, context);

    if (links.length === 0) {
      return new HypernetLink(counterpartyId, [], [], [], [], []);
    }

    return links[0];
  }
}
