import { BigNumber, EthereumAddress, HypernetLedger, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";
import { ELinkOperation } from "@interfaces/types/ELinkOperation";

/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILinkRepository {

    /**
     * Get all Hypernet Links for this client
     */
    getHypernetLedgers(): Promise<HypernetLedger[]>;

    /**
     * Given a linkId, return the associated Hypernet Link.
     * @param linkId The ID of the link to retrieve
     */
    getHypernetLedger(linkId: string): Promise<HypernetLedger>

    /**
     * Creates a Hypernet Link, internally represented by a set of 
     * one-to-one insurancePayment<-->parameterizedPayment
     * @todo we need to think about the stakeAmount, possibly refactor into a stake proportion
     *          with an associated value of the token - also, what happens if the value fluctuates?
     * @param consumerAccount the public identifier of the consumer (payer)
     * @param allowedPaymentTokens An array of addresses of ERC20 payment tokens that maybe used
     * @param stakeAmount the amount of Hypertoken the provider puts up as stake
     * @param stakeExpiration a unix timestamp 
     * @param disputeMediator the address of the dispute mediator as an Ethereum address
     */
    createHypernetLedger(
        consumerAccount: PublicIdentifier,
        allowedPaymentTokens: EthereumAddress[],
        stakeAmount: BigNumber,
        stakeExpiration: number,
        disputeMediator: PublicKey): Promise<HypernetLedger>;

    /**
     * Updates a Hypernet link via a provided option, ie sending funds or withdrawing funds.
     * @todo break this out into individual functions
     * @param linkId the id of the link to send funds on
     * @param operation the operation to commit (send, withdraw, etc)
     * @param data the operation-specific data needed (such as send or withdraw amount)
     */
    modifyHypernetLedger(linkId: string, operation: ELinkOperation, data: any): Promise<HypernetLedger>
}