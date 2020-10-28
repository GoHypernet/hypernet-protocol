import { ILinkRepository } from "@interfaces/data/ILinkRepository";
import { BigNumber, EthereumAddress, HypernetLink, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkStatus } from "@interfaces/types";
import { IBrowserNodeProvider, IConfigProvider, IContextProvider } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";

export class VectorLinkRepository implements ILinkRepository {
    constructor(protected browserNodeProvider: IBrowserNodeProvider, 
        protected configProvider: IConfigProvider,
        protected contextProvider: IContextProvider) {}

    public async getHypernetLinks(): Promise<HypernetLink[]> {
        const browserNode = await this.browserNodeProvider.getBrowserNode();

        

        return [];
    }

    public async createHypernetLink(consumerWallet: EthereumAddress,
        paymentToken: EthereumAddress,
        stakeAmount: BigNumber,
        disputeMediator: PublicKey,
        pullSettings: PullSettings | null): Promise<HypernetLink> {
            // Basic setup
            // TODO: Parallelize
            const config = await this.configProvider.getConfig();
            const context = await this.contextProvider.getInitializedContext();
            const browserNode = await this.browserNodeProvider.getBrowserNode();

            console.log(`publicIdentifier: ${context.publicIdentifier}`);
            console.log(`routerPublicIdentifier: ${config.routerPublicIdentifier}`);

            // We need to see if we already have a channel with the router setup.
            // const channelsResult = await browserNode.getStateChannelByParticipants({
            //     publicIdentifier: context.publicIdentifier,
            //     counterparty: config.routerPublicIdentifier,
            //     chainId: config.chainId
            // });

            const channelsResult = await browserNode.getStateChannels();
            


            // if (channelsResult.isError) {
            //     throw new Error("Cannot get channels!");
            // }

            if (channelsResult.isError) {
                throw new Error("Cannot get channels 2!");
            }
            // const channelsByParticipants = channelsResult.getValue();
            const channels2 = channelsResult.getValue();

            //console.log(channelsByParticipants);
            console.log(channels2);

            const channelResult = await browserNode.getStateChannel({channelAddress: channels2[0]});
            if (channelResult.isError) {
                throw new Error("Cannot get details of state channel!");
            }

            const channel = channelResult.getValue();


            // If the channel with the router does not exist, do a setup
            let channelAddress = "";
            if (channel == null || channel.aliceIdentifier != config.routerPublicIdentifier) {
                
                const setupResult = await browserNode.setup({
                    chainId: 1337,
                    counterpartyIdentifier: config.routerPublicIdentifier,
                    timeout: "8640"
                });

                if (setupResult.isError) {
                    console.log(setupResult.getError());
                    throw new Error("Cannot establish channel with router!");
                }

                channelAddress = setupResult.getValue().channelAddress;

                console.log(channelAddress);
            }
            else {
                channelAddress = channel.channelAddress;
            }

            // Now we can create a transaction! When creating a link, the first thing
            // to do is create an InsurancePayment on behalf of the provider
            const hypernetLinkId =  uuidv4();
            const insurancePaymentResult = await browserNode.conditionalTransfer({
                type: "HashlockTransfer",
                channelAddress: channelAddress,
                amount: stakeAmount.toString(),
                assetId: config.hypertokenAddress,
                details: {
                    lockHash: "lockhash",
                    expiry: "0"
                },
                recipient: consumerWallet,
                meta: {
                    hypernetLinkId: hypernetLinkId,
                    paymentTokenAddress: paymentToken
                }
            });
            
            if (insurancePaymentResult.isError) {
                console.log(insurancePaymentResult.getError());
                throw new Error("Cannot post an insurance payment!");
            }

            const insurancePayment = insurancePaymentResult.getValue();

            

            const link = new HypernetLink(hypernetLinkId,
                consumerWallet,
                context.account,
                paymentToken,
                disputeMediator,
                pullSettings,
                new BigNumber(0),
                new BigNumber(0),
                new BigNumber(0),
                stakeAmount,
                ELinkStatus.STAKED,
                channelAddress);

            return link;
        }
    
}