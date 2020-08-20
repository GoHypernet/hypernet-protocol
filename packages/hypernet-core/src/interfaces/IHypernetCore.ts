import { HypernetChannel, Deposit, BigNumber, Payment } from "@interfaces/objects";

export interface IHypernetCore {
  initialize(consumerWallet: string): Promise<void>;
  getActiveChannels(): Promise<HypernetChannel[]>;
  openChannel(consumerWallet: string, providerWallet: string): Promise<HypernetChannel>;
  depositIntoChannel(channelId: number, amount: BigNumber): Promise<Deposit>;
  sendFunds(channelId: number, amount: BigNumber): Promise<Payment>;
}
