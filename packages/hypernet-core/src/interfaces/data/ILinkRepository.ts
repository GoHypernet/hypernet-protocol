import { BigNumber, EthereumAddress, HypernetLink, PublicKey, PullSettings } from "@interfaces/objects";

export interface ILinkRepository {
    getHypernetLinks(): Promise<HypernetLink[]>;
    createHypernetLink(consumerWallet: EthereumAddress,
        paymentToken: EthereumAddress,
        stakeAmount: BigNumber,
        disputeMediator: PublicKey,
        pullSettings: PullSettings | null): Promise<HypernetLink>;
}