import { BigNumber, EthereumAddress, HypernetLink, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";

export interface ILinkRepository {

    getHypernetLinks(): Promise<HypernetLink[]>;

    /**
     * Creates a Hypernet Link, internally represented by a set of 
     * one-to-one insurancePayment<-->parameterizedPayment
     * @param consumerId the public identifier of the consumer (payer)
     * @param paymentToken the address of the ERC20 payment token that will be used
     * @param stakeAmount the amount of Hypertoken the provider puts up as stake
     * @param disputeMediator the address of the dispute mediator as an Ethereum address
     * @param pullSettings pull payment settings, if applicable
     */
    createHypernetLink(consumerId: PublicIdentifier,
        paymentToken: EthereumAddress,
        stakeAmount: BigNumber,
        disputeMediator: PublicKey,
        pullSettings: PullSettings | null): Promise<HypernetLink>;
}