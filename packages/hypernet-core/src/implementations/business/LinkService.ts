import { FullTransferState } from "@connext/vector-types";
import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink } from "@interfaces/objects";

export class LinkService implements ILinkService {
  constructor(protected linkRepository: ILinkRepository) {}

  /**
   * 
   */
  public async getLinks(): Promise<HypernetLink[]> {
    return this.linkRepository.getHypernetLinks();
  }
}
