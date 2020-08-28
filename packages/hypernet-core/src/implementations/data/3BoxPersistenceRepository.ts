import { IPersistenceRepository } from "@interfaces/data";
import { EthereumAddress, HypernetLink } from "@interfaces/objects";
import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
import { BoxSpace } from "3box";
import { plainToClass, serialize } from "class-transformer";

export class ThreeBoxPersistenceRepository implements IPersistenceRepository {
  constructor(protected boxUtils: IThreeBoxUtils, protected configProvider: IConfigProvider) {}

  /**
   * createLink() will store the link ID in the user's active link space,
   * @param link
   */
  public async createLink(link: HypernetLink): Promise<HypernetLink> {
    const config = await this.configProvider.getConfig();

    // Check if the link already exists
    const openLinks = await this.getOpenLinkIds();

    if (openLinks.includes(link.id)) {
      throw new Error("Cannot create a link that already exists!");
    }

    // Sanity check
    if (link.id == null) {
      throw new Error("Link to create must be given an ID first!");
    }

    // First, we'll create a new space and write the link's data into it.a2
    const linkSpaces = await this.boxUtils.getSpaces([link.id]);
    const linkSpace = linkSpaces[link.id];

    let success = await linkSpace.private.set(config.linkDataKey, serialize(link));
    if (!success) {
      throw new Error("Can not write to the link space!");
    }

    // Second, let's write the new link into the list of open links
    const space = await this.getHypernetProtocolSpace();

    openLinks.push(link.id);

    // Now we won't forget the link
    success = await space.private.set(config.openLinkKey, serialize(openLinks));
    if (!success) {
      throw new Error("Can't update the link store!");
    }

    return link;
  }

  public async getActiveLinks(): Promise<HypernetLink[]> {
    const returnLinks = new Array<HypernetLink>();

    const config = await this.configProvider.getConfig();

    // Get the list of open channels from the space.
    const openLinks = await this.getOpenLinkIds();

    if (openLinks == null) {
      return returnLinks;
    }

    // Now we connect to the spaces for each of those channels
    const linkSpaces = await this.boxUtils.getSpaces(openLinks);

    // Loop over the spaces for each channel
    for (const [spaceName, space] of Object.entries(linkSpaces)) {
      // The space has a key with all the hypernet information
      const linkDataString = await space.private.get(config.linkDataKey);
      const plain = JSON.parse(linkDataString) as object;
      const link = plainToClass(HypernetLink, plain);

      if (link != null) {
        returnLinks.push(link);
      }
    }

    return returnLinks;
  }

  public async getAllChannels(address: EthereumAddress): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }

  public async getChannelsById(channelIds: string[]): Promise<HypernetLink[]> {
    throw new Error("Method not implemented.");
  }

  protected async getHypernetProtocolSpace(): Promise<BoxSpace> {
    const config = await this.configProvider.getConfig();

    // Get the main space, the list of channels is here.
    const spaces = await this.boxUtils.getSpaces([config.spaceName]);
    return spaces[config.spaceName];
  }

  protected async getOpenLinkIds(): Promise<string[]> {
    const config = await this.configProvider.getConfig();

    const space = await this.getHypernetProtocolSpace();

    const openLinksString = await space.private.get(config.openLinkKey);

    if (openLinksString == null) {
      return new Array<string>();
    }

    return JSON.parse(openLinksString) as string[];
  }
}
