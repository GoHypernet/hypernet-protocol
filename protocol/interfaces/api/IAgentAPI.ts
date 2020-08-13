import {Address, HypernetChannel} from "@interfaces/objects";

export interface IAgentAPI {
    openChannel(consumerWallet: Address, providerWallet: Address): Promise<HypernetChannel>;
    sendFunds(channelId: int, amount: float): Promise<Payment>;
}