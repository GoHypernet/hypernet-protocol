import { IPersistenceRepository } from "@interfaces/data";
import { EthereumAddress, HypernetLink } from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";

export class ThreeBoxPersistenceRepository implements IPersistenceRepository {
  constructor(protected boxUtils: IThreeBoxUtils, protected configProvider: IConfigProvider) {}
  
  /**
   * createLink() will store the link ID in the user's active link space,
   * @param link 
   */
  public async createLink(link: HypernetLink): Promise<HypernetLink> {
    throw new Error("Method not implemented.");
  }

  public async getActiveLinks(): Promise<HypernetLink[]> {
    const returnChannels = new Array<HypernetLink>();

    const config = await this.configProvider.getConfig();

    // Get the main space, the list of channels is here.
    const spaces = await this.boxUtils.getSpaces([config.spaceName]);
    const mainSpace = spaces[config.spaceName];

    // Get the list of open channels from the space.a2
    const openChannels = await mainSpace.private.get<string[]>(config.openChannelKey);

    if (openChannels == null) {
      return returnChannels;
    }

    // Now we connect to the spaces for each of those channels
    const channelSpaces = await this.boxUtils.getSpaces(openChannels);

    // Loop over the spaces for each channel
    for (const [spaceName, space] of Object.entries(channelSpaces)) {
      // The space has a key with all the hypernet information

      // returnChannels.push(new HypernetLink());
    }

    return returnChannels;
  }

  public async getAllChannels(address: EthereumAddress): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }

  public async getChannelsById(channelIds: string[]): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }
}
