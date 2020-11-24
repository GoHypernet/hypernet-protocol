import { FullTransferState } from "@connext/vector-types";
import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink } from "@interfaces/objects";

export class LinkService implements ILinkService {
    constructor(protected ledgerRepository: ILinkRepository) {}
    
    public async getLedgers(): Promise<HypernetLink[]> {
        return this.ledgerRepository.getHypernetLinks();
    }

}