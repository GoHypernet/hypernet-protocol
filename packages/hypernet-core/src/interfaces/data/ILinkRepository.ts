import { BigNumber, EthereumAddress, HypernetLink, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkOperation } from "@interfaces/types/ELinkOperation";

export interface ILinkRepository {

    getHypernetLinks(): Promise<HypernetLink[]>;

    /**
     * Given the ID of the link, return it.
     * @param linkId The ID of the link to retrieve
     */
    getHypernetLink(linkId: string): Promise<HypernetLink>

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

    /**
     * Updates a Hypernet link via a provided option, ie sending funds or withdrawing funds.
     * @param linkId the id of the link to send funds on
     * @param operation the operation to commit (send, withdraw, etc)
     * @param data the operation-specific data needed (such as send or withdraw amount)
     */
    modifyHypernetLink(linkId: string, operation: ELinkOperation, data: any): Promise<HypernetLink>
}