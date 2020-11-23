import { BigNumber, EthereumAddress, HypernetLink, Payment, PublicIdentifier, PublicKey } from "@interfaces/objects";


/**
 * @todo What is the main role/purpose of this class? Description here.
 */
export interface ILinkRepository {

    /**
     * Get all Hypernet Links for this client
     */
    getHypernetLinks(): Promise<HypernetLink[]>;

    /**
     * Given a linkId, return the associated Hypernet Link.
     * @param linkId The ID of the link to retrieve
     */
    getHypernetLink(linkId: string): Promise<HypernetLink>;

    /**
     * Creates a push payment and returns it. Nothing moves until
     * the payment is accepted; the payment will return with the
     * "PROPOSED" status. This function just creates an OfferTransfer.
     */
    createPushPayment(
        counterPartyAccount: PublicIdentifier,
        amount: BigNumber,
        expirationDate: moment.Moment,
        requiredStake: BigNumber,
        paymentToken: EthereumAddress,
        disputeMediator: PublicKey): Promise<Payment>;

    getPaymentsById(paymentIds: string[]): Promise<Map<string, Payment>>;

    provideAssets(paymentIds: string[]): Promise<Map<string, Payment>> 
    provideStakes(paymentIds: string[]): Promise<Map<string, Payment>>
    finalizePayments(paymentIds: string[]): Promise<Map<string, Payment>>
}