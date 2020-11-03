import { ILinkRepository } from "@interfaces/data/ILinkRepository";
import { BigNumber, EthereumAddress, HypernetLink, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkStatus } from "@interfaces/types";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider, IVectorUtils } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";
import { createlockHash, getRandomBytes32 } from "@connext/vector-utils";

export class VectorLinkRepository implements ILinkRepository {
    constructor(protected browserNodeProvider: IBrowserNodeProvider,
        protected configProvider: IConfigProvider,
        protected contextProvider: IContextProvider,
        protected vectorUtils: IVectorUtils) { }

    public async getHypernetLinks(): Promise<HypernetLink[]> {
        const browserNode = await this.browserNodeProvider.getBrowserNode();



        return [];
    }

    public async sendLinkPayment(link: HypernetLink): Promise<void> {
        const browserNode = await this.browserNodeProvider.getBrowserNode()
        const routerChannelAddress = await this.vectorUtils.getRouterChannelAddress()
        const config = await this.configProvider.getConfig()
        const stakeAmount = link.providerStake

        const paymentResult = await browserNode.conditionalTransfer({
            type: "HashlockTransfer",
            channelAddress: routerChannelAddress,
            amount: stakeAmount.toString(),
            assetId: config.hypertokenAddress,
            details: {
                lockHash: createlockHash(getRandomBytes32()),
                expiry: "0"
            },
            recipient: link.consumer,
            meta: {
                hypernetLinkId: link.id,
                paymentTokenAddress: link.paymentToken
            }
        });

        if (paymentResult.isError) {
            console.log(paymentResult.getError());
            throw new Error("Cannot post an insurance payment!");
        }

        const insurancePayment = paymentResult.getValue();
    }

    public async requestCollateralization(link: HypernetLink): Promise<void> {
        const browserNode = await this.browserNodeProvider.getBrowserNode()
        const routerChannelAddress= await this.vectorUtils.getRouterChannelAddress()
        const config = await this.configProvider.getConfig()

        await browserNode.requestCollateral({channelAddress: routerChannelAddress, assetId: config.hypertokenAddress})
    }

    public async createHypernetLink(
        consumerId: PublicIdentifier,
        paymentToken: EthereumAddress,
        stakeAmount: BigNumber,
        disputeMediator: PublicKey,
        pullSettings: PullSettings | null): Promise<HypernetLink> {

        // Basic setup
        const configPromise = this.configProvider.getConfig();
        const contextPromise = this.contextProvider.getInitializedContext();
        const browserNodePromise = this.browserNodeProvider.getBrowserNode();
        const routerChannelAddressPromise = this.vectorUtils.getRouterChannelAddress();

        const [config, context, browserNode, routerChannelAddress] =
            await Promise.all([configPromise, contextPromise, browserNodePromise,
                routerChannelAddressPromise]);

        const hypernetLinkId = uuidv4();
        
        const link = new HypernetLink(
            hypernetLinkId,
            consumerId,
            context.publicIdentifier,
            paymentToken,
            disputeMediator,
            pullSettings,
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            stakeAmount,
            ELinkStatus.STAKED,
            routerChannelAddress);

        return link;
    }
}