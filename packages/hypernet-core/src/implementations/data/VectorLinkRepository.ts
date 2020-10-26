import { ILinkRepository } from "@interfaces/data/ILinkRepository";
import { HypernetLink } from "@interfaces/objects";
import { IBrowserNodeProvider } from "@interfaces/utilities";

class VectorLinkRepository implements ILinkRepository {
    constructor(protected browserNodeProvider: IBrowserNodeProvider) {}

    public async getHypernetLinks(): Promise<HypernetLink[]> {
        const browserNode = await this.browserNodeProvider.getBrowserNode();

        const channelsResult = await browserNode.getStateChannels();

        if (channelsResult.isError) {
            throw new Error("Cannot retrieve state channels!");
        }
        const channels = channelsResult.getValue();

        return [];
    }
    
}