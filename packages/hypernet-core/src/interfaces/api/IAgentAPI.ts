import { Address, HypernetChannel, BigNumber, Payment } from "@interfaces/objects";

export interface IAgentAPI {
  openChannel(consumerWallet: Address, providerWallet: Address): Promise<HypernetChannel>;
  sendFunds(channelId: number, amount: BigNumber): Promise<Payment>;
}
