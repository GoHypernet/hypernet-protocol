import { BigNumber, EthereumAddress, HypernetLink, PublicIdentifier, PublicKey, PullSettings } from "@interfaces/objects";

export interface ILinkRepository {
    getHypernetLinks(): Promise<HypernetLink[]>;
    createHypernetLink(consumerId: PublicIdentifier,
        paymentToken: EthereumAddress,
        stakeAmount: BigNumber,
        disputeMediator: PublicKey,
        pullSettings: PullSettings | null): Promise<HypernetLink>;
}