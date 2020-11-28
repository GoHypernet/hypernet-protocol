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
   *
   * @param paymentIds
   */
  public async provideAssets(paymentIds: string[]): Promise<Map<string, Payment>> {
    throw new Error("Method not yet implemented");
  }

  /**
   *
   * @param paymentIds
   */
  public async provideStakes(paymentIds: string[]): Promise<Map<string, Payment>> {
    throw new Error("Method not yet implemented");
  }

  /**
   *
   * @param paymentIds
   */
  public async finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>> {
    throw new Error("Method not yet implemented");
  }

  /**
   *
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

    const activeTransfers = activeTransfersRes.getValue();
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

  // sendPayment

  // public async createHypernetLink(
  //     consumerAccount: PublicIdentifier,
  //     allowedPaymentTokens: EthereumAddress[],
  //     stakeAmount: BigNumber,
  //     stakeExpiration: number,
  //     disputeMediator: PublicKey): Promise<HypernetLink> {
  //     // Basic setup
  //     const configPromise = this.configProvider.getConfig();
  //     const contextPromise = this.contextProvider.getInitializedContext();
  //     const browserNodePromise = this.browserNodeProvider.getBrowserNode();
  //     const routerChannelAddressPromise = this.vectorUtils.getRouterChannelAddress();

  //     const [config, context, browserNode, routerChannelAddress] =
  //         await Promise.all([configPromise, contextPromise, browserNodePromise,
  //             routerChannelAddressPromise]);

  //     // const blah = await browserNode.requestCollateral({channelAddress: routerChannelAddress,
  //     // assetId: config.hypertokenAddress});
  //     // console.log(blah);

  //     // Now we can create a transaction! When creating a link, the first thing
  //     // to do is create an InsurancePayment on behalf of the provider
  //     const HypernetLinkId = uuidv4();
  //     const insurancePaymentResult = await browserNode.conditionalTransfer({
  //         type: "HashlockTransfer",
  //         channelAddress: routerChannelAddress,
  //         amount: stakeAmount.toString(),
  //         assetId: config.hypertokenAddress,
  //         details: {
  //             lockHash: createlockHash(getRandomBytes32()),
  //             expiry: "0"
  //         },
  //         recipient: consumerAccount,
  //         meta: {
  //             HypernetLinkId: HypernetLinkId,
  //             allowedPaymentTokens: allowedPaymentTokens
  //         }
  //     });

  //     if (insurancePaymentResult.isError) {
  //         console.log(insurancePaymentResult.getError());
  //         throw new Error("Cannot post an insurance payment!");
  //     }

  //     const insurancePayment = insurancePaymentResult.getValue();

  //     const link = new HypernetLink(
  //         HypernetLinkId,
  //         consumerAccount,
  //         context.publicIdentifier,
  //         allowedPaymentTokens,
  //         disputeMediator,
  //         pullSettings,
  //         BigNumber.from(0),
  //         BigNumber.from(0),
  //         BigNumber.from(0),
  //         stakeAmount,
  //         ELinkStatus.STAKED,
  //         routerChannelAddress
  //     );

  //     return link;
  // }
}
