import { NodeError } from "@connext/vector-types";
import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";

export class LinkService implements ILinkService {
  constructor(protected linkRepository: ILinkRepository) {}

  /**
   *
   */
  public getLinks(): ResultAsync<
  HypernetLink[],
  RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
> {
    return this.linkRepository.getHypernetLinks();
  }
}
