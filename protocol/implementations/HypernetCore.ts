import { IHypernetCore } from "@interfaces/IHypernetCore";
import {HypernetChannel, Deposit} from "@interfaces/objects"

export class HypernetCore implements IHypernetCore{
    openChannel(consumerWallet: string, providerWallet: string): Promise<HypernetChannel> {
        throw new Error("Method not implemented.");
    }
    depositIntoChannel(channelId: any, amount: any): Promise<Deposit> {
        throw new Error("Method not implemented.");
    }
}