import {HypernetChannel, Deposit, BigNumber} from "@interfaces/objects";

export interface IHypernetCore {
    openChannel(consumerWallet: string, providerWallet: string): Promise<HypernetChannel>;
    depositIntoChannel(channelId: number, amount: BigNumber): Promise<Deposit>;
}