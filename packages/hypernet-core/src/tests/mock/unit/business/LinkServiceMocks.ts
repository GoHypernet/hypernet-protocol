import { mock, instance } from "ts-mockito";

import { ILinkRepository } from "@interfaces/data";
import { LinkService } from "@implementations/business";
import { HypernetLink } from "@interfaces/objects";
import { ILinkService } from "@interfaces/business";

export default class LinkServiceMocks {
  public linkRepository: ILinkRepository = mock<ILinkRepository>();
  public hypernetLink: HypernetLink = mock(HypernetLink);

  public getLinkRepositoryFactory(): ILinkRepository {
    return instance(this.linkRepository);
  }

  public getHypernetLinkFactory(): HypernetLink {
    return instance(this.hypernetLink);
  }

  public getServiceFactory(): ILinkService {
    return new LinkService(this.getLinkRepositoryFactory());
  }
}
