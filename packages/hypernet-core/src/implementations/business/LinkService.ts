import { ILinkService } from "@interfaces/business";
import { ILedgerRepository } from "@interfaces/data";
import { HypernetLink } from "@interfaces/objects";

export class LinkService implements ILinkService {
    constructor(protected ledgerRespository: ILedgerRepository) {

    }
    public async getLedgers(): Promise<HypernetLink[]> {
        return this.ledgerRespository.getHypernetLinks();
    }

}