import { ILinkRepository } from "@interfaces/data/ILinkRepository";
import { BigNumber, EthereumAddress, HypernetLedger, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkStatus } from "@interfaces/types";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider, IVectorUtils } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";
import { createlockHash, getRandomBytes32 } from "@connext/vector-utils";
import { ELinkOperation } from "@interfaces/types/ELinkOperation";
import { VectorUtils } from "@implementations/utilities/VectorUtils";

export class VectorLinkRepository implements ILinkRepository {
    constructor(protected browserNodeProvider: IBrowserNodeProvider,
        protected configProvider: IConfigProvider,
        protected contextProvider: IContextProvider,
        protected vectorUtils: IVectorUtils) { }

    public async getHypernetLedgers(): Promise<HypernetLedger[]> {
        const browserNode = await this.browserNodeProvider.getBrowserNode();



        return [];
    }

    /**
     * Given the ID of the link, return it.
     * @param linkId The ID of the link to retrieve
     */
    public async getHypernetLedger(linkId: string): Promise<HypernetLedger> {
        let links = await this.getHypernetLedgers()

        let retLink = links.filter((link) => {
            link.id == linkId
        })

        if (retLink.length > 1) {
            throw new Error('Multiple links found!')
        } else if (retLink.length == 0) {
            throw new Error('Could not find linke!')
        }

        return retLink[0]
    }

    public async createHypernetLedger(
        consumerAccount: PublicIdentifier,
        allowedPaymentTokens: EthereumAddress[],
        stakeAmount: BigNumber,
        stakeExpiration: number,
        disputeMediator: PublicKey): Promise<HypernetLedger> {
        // Basic setup
        const configPromise = this.configProvider.getConfig();
        const contextPromise = this.contextProvider.getInitializedContext();
        const browserNodePromise = this.browserNodeProvider.getBrowserNode();
        const routerChannelAddressPromise = this.vectorUtils.getRouterChannelAddress();

        const [config, context, browserNode, routerChannelAddress] =
            await Promise.all([configPromise, contextPromise, browserNodePromise,
                routerChannelAddressPromise]);

        // const blah = await browserNode.requestCollateral({channelAddress: routerChannelAddress,
        // assetId: config.hypertokenAddress});
        // console.log(blah);

        // Now we can create a transaction! When creating a link, the first thing
        // to do is create an InsurancePayment on behalf of the provider
        const HypernetLedgerId = uuidv4();
        const insurancePaymentResult = await browserNode.conditionalTransfer({
            type: "HashlockTransfer",
            channelAddress: routerChannelAddress,
            amount: stakeAmount.toString(),
            assetId: config.hypertokenAddress,
            details: {
                lockHash: createlockHash(getRandomBytes32()),
                expiry: "0"
            },
            recipient: consumerAccount,
            meta: {
                HypernetLedgerId: HypernetLedgerId,
                allowedPaymentTokens: allowedPaymentTokens
            }
        });

        if (insurancePaymentResult.isError) {
            console.log(insurancePaymentResult.getError());
            throw new Error("Cannot post an insurance payment!");
        }

        const insurancePayment = insurancePaymentResult.getValue();

        const link = new HypernetLedger(
            HypernetLedgerId,
            consumerAccount,
            context.publicIdentifier,
            allowedPaymentTokens,
            disputeMediator,
            pullSettings,
            BigNumber.from(0),
            BigNumber.from(0),
            BigNumber.from(0),
            stakeAmount,
            ELinkStatus.STAKED,
            routerChannelAddress
        );

        return link;
    }

    public async modifyHypernetLedger(linkId: string, operation: ELinkOperation, data: any): Promise<HypernetLedger> {
        let link = await this.getHypernetLedger(linkId)

        switch(operation) {
            case ELinkOperation.SEND_FUNDS: {
                let updatedLink = await this.sendFunds(link, data)
                return updatedLink
            } break;

            case ELinkOperation.WITHDRAW_FUNDS: {
                let updatedLink = await this.withdrawFunds(link, data)
                return updatedLink
            } break;

            default: {
                throw new Error('Invalid operation.')
            }
        }
    }

    /**
     * Sends funds via Connext/Vector payment channels.
     * Returns the updated Hypernet Link.
     * @param amount the amount of funds to send
     * @todo figure out what createXPayment should actually return
     */
    private async sendFunds(link: HypernetLedger, amount: string): Promise<HypernetLedger> {
        await this.vectorUtils.createParameterizedPayment(param1, param2, etc)
        
        throw new Error('Method not yet implemented.')
    }

    private async withdrawFunds(link: HypernetLedger, amount: string): Promise<HypernetLedger> {
        throw new Error('Method not yet implemented.')
    }
}