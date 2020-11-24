import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink } from "@interfaces/objects";

export class LinkService implements ILinkService {
    constructor(protected ledgerRespository: ILinkRepository) {

    }
    
    public async getLinks(): Promise<HypernetLink[]> {
        return this.ledgerRespository.getHypernetLinks();
    }

}