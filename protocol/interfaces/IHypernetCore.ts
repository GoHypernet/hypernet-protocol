import {Channel, Deposit} from "@interfaces/objects";

export interface IHypernetCore {
    openChannel(consumerWallet: string, providerWallet: string): Promise<Channel>;
    depositIntoChannel(channelId: int, amount: float): Promise<Deposit>;
}