import { IHypernetCore } from "@interfaces/IHypernetCore";

export class HypernetCore implements IHypernetCore{
    openChannel(consumerWallet: string, providerWallet: string): Promise<import("../interfaces/objects").Channel> {
        throw new Error("Method not implemented.");
    }
    depositIntoChannel(channelId: any, amount: any): Promise<import("../interfaces/objects").Deposit> {
        throw new Error("Method not implemented.");
    }
}