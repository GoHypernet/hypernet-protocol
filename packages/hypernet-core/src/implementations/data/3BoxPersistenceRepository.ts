import { IPersistenceRepository } from "@interfaces/data";
import { Address, HypernetChannel} from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";



export class ThreeBoxPersistenceRepository implements IPersistenceRepository {
    constructor(protected boxUtils: IThreeBoxUtils, 
        protected configProvider: IConfigProvider) {}

    public async getActiveChannels(): Promise<HypernetChannel[]> {
        const returnChannels = new Array<HypernetChannel>();

        const config = await this.configProvider.getConfig();

        // Get the main space, the list of channels is here.
        const mainSpace = (await this.boxUtils.getSpaces([config.spaceName]))[config.spaceName];

        // Get the list of open channels from the space.a2
        const openChannels = await mainSpace.private.get<string[]>(config.openChannelKey)

        // Now we connect to the spaces for each of those channels
        const channelSpaces = await this.boxUtils.getSpaces(openChannels);

        // Loop over the spaces for each channel
        for (const [spaceName, space] of Object.entries(channelSpaces)) {
            // The space has a key with all the hypernet information

            returnChannels.push(new HypernetChannel())
        }

        return returnChannels;
    }

    getAllChannels(address: Address): Promise<HypernetChannel[]> {
        throw new Error("Method not implemented.");
    }

    getChannelsById(channelIds: string[]): Promise<HypernetChannel[]> {
        throw new Error("Method not implemented.");
    }

}