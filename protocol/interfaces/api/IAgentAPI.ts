export interface IAgentAPI {
    openChannel(consumerWallet: string, providerWallet: string): Promise<Channel>;
    sendFunds(channelId: int, amount: float): Promise<Payment>;
}