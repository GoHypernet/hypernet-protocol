import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink } from "@hypernetlabs/objects";
import { CoreUninitializedError, RouterChannelUnknownError, VectorError } from "@hypernetlabs/objects/errors";
import { ResultAsync } from "neverthrow";

export class LinkService implements ILinkService {
  constructor(protected linkRepository: ILinkRepository) {}

  /**
   *
   */
  public getLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | VectorError | Error
  > {
    return this.linkRepository.getHypernetLinks();
  }
}
