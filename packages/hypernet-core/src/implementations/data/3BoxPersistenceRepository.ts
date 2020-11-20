// import { IPersistenceRepository } from "@interfaces/data";
// import { EthereumAddress, HypernetLedger, LinkMetadata } from "@interfaces/objects";
// import { IThreeBoxUtils } from "@interfaces/utilities/IThreeBoxUtils";
// import { IConfigProvider } from "@interfaces/utilities/IConfigProvider";
// import { plainToClass, serialize } from "class-transformer";
// import { ELinkRole } from "@interfaces/types";

// export class ThreeBoxPersistenceRepository implements IPersistenceRepository {
//   constructor(protected boxUtils: IThreeBoxUtils, protected configProvider: IConfigProvider) {}

//   /**
//    * createLink() will store the link ID in the user's active link space,
//    * @param link
//    */
//   public async createLink(link: HypernetLedger): Promise<HypernetLedger> {
//     // Sanity check
//     if (link.id == null) {
//       throw new Error("Link to create must be given an ID first!");
//     }

//     const config = await this.configProvider.getConfig();

//     // Check if the link already exists
//     const openLinks = await this.getOpenLinkMetadata();

//     const existingLink = openLinks.find((openLink) => {
//       return openLink.linkId === link.id;
//     });
//     if (existingLink != null) {
//       throw new Error("Cannot create a link that already exists!");
//     }

//     // First, we'll create a new space and write the link's data into it.a2
//     const linkSpaces = await this.boxUtils.getSpaces([link.id]);
//     const linkSpace = linkSpaces[link.id];

//     let success = await linkSpace.private.set("config.linkDataKey", serialize(link));
//     if (!success) {
//       throw new Error("Can not write to the link space!");
//     }

//     // Second, let's write the new link into the list of open links
//     const space = await this.boxUtils.getHypernetProtocolSpace();

//     openLinks.push(new LinkMetadata(link.id, link.consumer, link.provider));

//     // Now we won't forget the link
//     success = await space.private.set("config.openLinkKey", serialize(openLinks));
//     if (!success) {
//       throw new Error("Can't update the link store!");
//     }

//     return link;
//   }

//   public async getActiveLinks(): Promise<HypernetLedger[]> {
//     const returnLinks = new Array<HypernetLedger>();

//     const config = await this.configProvider.getConfig();

//     // Get the list of open links from the space.
//     const openLinks = await this.getOpenLinkMetadata();

//     if (openLinks == null) {
//       return returnLinks;
//     }

//     // Now we connect to the spaces for each of those links
//     const linkIds = openLinks.map((metadata) => {
//       if (metadata.linkId == null) {
//         return (metadata as unknown) as string;
//       }
//       return metadata.linkId;
//     });
//     const linkSpaces = await this.boxUtils.getSpaces(linkIds);

//     // Loop over the spaces for each link
//     for (const [spaceName, space] of Object.entries(linkSpaces)) {
//       // The space has a key with all the hypernet information
//       const linkDataString = await space.private.get("config.linkDataKey");
//       const plain = JSON.parse(linkDataString) as object;
//       const link = plainToClass(HypernetLedger, plain);

//       if (link != null) {
//         returnLinks.push(link);
//       }
//     }

//     return returnLinks;
//   }

//   public async getLinksById(linkIds: string[]): Promise<{ [linkId: string]: HypernetLedger }> {
//     const returnLinks: { [linkId: string]: HypernetLedger } = {};

//     const config = await this.configProvider.getConfig();

//     // Get the list of open links from the space.
//     const openLinks = await this.getOpenLinkMetadata();

//     if (openLinks == null) {
//       return returnLinks;
//     }

//     // Now we connect to the spaces for each of those links
//     const openLinkIds = openLinks.map((metadata) => {
//       return metadata.linkId;
//     });

//     if (!linkIds.every((linkId) => openLinkIds.includes(linkId))) {
//       throw new Error("Invalid link id. Requested link Id is not an open link!");
//     }

//     const linkSpaces = await this.boxUtils.getSpaces(linkIds);

//     // Loop over the spaces for each link
//     for (const [, space] of Object.entries(linkSpaces)) {
//       // The space has a key with all the hypernet information
//       const linkDataString = await space.private.get("config.linkDataKey");
//       const plain = JSON.parse(linkDataString) as object;
//       const link = plainToClass(HypernetLedger, plain);

//       if (link != null) {
//         returnLinks[link.id] = link;
//       }
//     }

//     return returnLinks;
//   }

//   public async getLinksByParticipant(consumerOrProviderIds: string[]): Promise<HypernetLedger[]> {
//     const returnLinks = new Array<HypernetLedger>();

//     const config = await this.configProvider.getConfig();

//     // Get the list of open links from the space.
//     const openLinks = await this.getOpenLinkMetadata();

//     if (openLinks == null) {
//       return returnLinks;
//     }

//     // We can do this lookup just with the metadata.
//     const matchingLinkMetadata = openLinks.filter((metadata) => {
//       return consumerOrProviderIds.includes(metadata.consumer) || consumerOrProviderIds.includes(metadata.provider);
//     });

//     // Get the link Ids
//     const linkIds = matchingLinkMetadata.map((metadata) => {
//       if (metadata.linkId == null) {
//         return (metadata as unknown) as string;
//       }
//       return metadata.linkId;
//     });

//     // Now we connect to the spaces for each of those links
//     const linkSpaces = await this.boxUtils.getSpaces(linkIds);

//     // Loop over the spaces for each link
//     for (const [spaceName, space] of Object.entries(linkSpaces)) {
//       // The space has a key with all the hypernet information
//       const linkDataString = await space.private.get("config.linkDataKey");
//       const plain = JSON.parse(linkDataString) as object;
//       const link = plainToClass(HypernetLedger, plain);

//       if (link != null) {
//         returnLinks.push(link);
//       }
//     }

//     return returnLinks;
//   }

//   public async getLinkByAddressAndRole(consumerOrProviderId: string, ourRole: ELinkRole): Promise<HypernetLedger | null> {
//     const config = await this.configProvider.getConfig();

//     // Get the list of open links from the space.
//     const openLinks = await this.getOpenLinkMetadata();

//     if (openLinks == null) {
//       return null;
//     }

//     // We can do this lookup just with the metadata.
//     const matchingLinkMetadata = openLinks.filter((metadata) => {
//       return consumerOrProviderId === metadata.consumer || consumerOrProviderId === metadata.provider;
//     });

//     // Get the link Ids
//     const linkIds = matchingLinkMetadata.map((metadata) => {
//       if (metadata.linkId == null) {
//         return (metadata as unknown) as string;
//       }
//       return metadata.linkId;
//     });

//     // Now we connect to the spaces for each of those links
//     const linkSpaces = await this.boxUtils.getSpaces(linkIds);

//     // Loop over the spaces for each link
//     for (const [spaceName, space] of Object.entries(linkSpaces)) {
//       // The space has a key with all the hypernet information
//       const linkDataString = await space.private.get("config.linkDataKey");
//       const plain = JSON.parse(linkDataString) as object;
//       const link = plainToClass(HypernetLedger, plain);

//       if (link != null) {
//         return link;
//       }
//     }

//     return null;
//   }

//   /**
//    * Updates a link in the 3box space.
//    * @param link The existing link object
//    */
//   public async updateLink(link: HypernetLedger): Promise<void> {
//     // First we'll do some sanity checking
//     if (link.id == null) {
//       throw new Error("Can not update a link that does not have an ID");
//     }

//     // Get the link space
//     const linkSpaces = await this.boxUtils.getSpaces([link.id]);
//     const linkSpace = linkSpaces[link.id];

//     const config = await this.configProvider.getConfig();

//     const success = await linkSpace.private.set("config.linkDataKey", serialize(link));
//     if (!success) {
//       throw new Error("Can not write to the link space!");
//     }
//   }

//   public async clearLinks(): Promise<void> {
//     const config = await this.configProvider.getConfig();

//     // Get the list of open links from the space.
//     const openLinks = await this.getOpenLinkMetadata();

//     if (openLinks.length === 0) {
//       return;
//     }

//     // Now we connect to the spaces for each of those links
//     const linkIds = openLinks.map((metadata) => {
//       if (metadata.linkId == null) {
//         return (metadata as unknown) as string;
//       }
//       return metadata.linkId;
//     });
//     const linkSpaces = await this.boxUtils.getSpaces(linkIds);

//     // Loop over the spaces for each link
//     for (const [, space] of Object.entries(linkSpaces)) {
//       // The space has a key with all the hypernet information
//       await space.private.set("config.linkDataKey", "");
//     }

//     // Now eliminate the metadata
//     const mainSpace = await this.boxUtils.getHypernetProtocolSpace();
//     await mainSpace.private.set("config.openLinkKey", "");
//   }

//   protected async getOpenLinkMetadata(): Promise<LinkMetadata[]> {
//     const returnLinks = new Array<LinkMetadata>();

//     const config = await this.configProvider.getConfig();

//     const space = await this.boxUtils.getHypernetProtocolSpace();

//     const openLinksString = await space.private.get("config.openLinkKey");

//     if (openLinksString == null || openLinksString === "") {
//       return [];
//     }

//     const plain = JSON.parse(openLinksString) as object[];

//     return plain.map((plainLink) => {
//       return plainToClass(LinkMetadata, plainLink);
//     });
//   }
// }
